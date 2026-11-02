"""Offline tests for backend/build.py – run with: python3 -m unittest discover -s backend"""

import importlib.util
import json
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

_spec = importlib.util.spec_from_file_location("injury_build", Path(__file__).with_name("build.py"))
nba = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(nba)

NOW = datetime(2026, 11, 1, 9, tzinfo=timezone.utc)


def _athlete(aid, name, salary=None):
    a = {"id": aid, "displayName": name, "position": {"abbreviation": "G"}, "age": 25}
    if salary is not None:
        a["contract"] = {"salary": salary, "season": {"year": nba.SEASON_YEAR}}
    return a


def _inj(aid, name, kind, status="Out", date="2026-10-28T12:00Z"):
    return {"status": status, "date": date, "shortComment": f"{name} ({kind}) is out.",
            "details": {"type": kind, "returnDate": "2026-11-20"},
            "athlete": {"displayName": name, "links": [{"href": f"https://www.espn.com/nba/player/_/id/{aid}/x"}]}}


def make_raw(injuries):
    teams, rosters = [], []
    for t in range(30):
        teams.append({"id": str(t), "abbreviation": f"T{t:02d}", "displayName": f"Team {t}", "color": "112233"})
        rosters.append({"athletes": [_athlete(f"{t}{i:02d}", f"Player {t}-{i}", salary=(t * 15 + i + 1) * 1_000_000)
                                     for i in range(14)] + [_athlete(f"{t}99", f"Two-Way {t}")]})
    return {
        "teams": teams, "rosters": rosters,
        "injuries": {"timestamp": "2026-11-01T01:00:00Z", "injuries": [{"injuries": injuries}]},
        "standings": {"children": [{"abbreviation": "East", "standings": {"entries": [
            {"team": {"abbreviation": "T00"}, "stats": [{"name": "wins", "value": 4}, {"name": "losses", "value": 2}]}]}}]},
        "news": {"articles": [
            {"type": "HeadlineNews", "headline": "Star suffers torn ACL, out for season", "published": "2026-11-01T10:00Z",
             "links": {"web": {"href": "https://espn.com/a"}}},
            {"type": "HeadlineNews", "headline": "Halloween costume trend returns", "published": "2026-11-01T11:00Z"},
            {"type": "Recap", "headline": "Team wins despite injury", "published": "2026-11-01T12:00Z"},
        ]},
    }


class BuildTest(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.tmp = Path(self._tmp.name)

    def tearDown(self):
        self._tmp.cleanup()

    def test_transform_sorts_by_salary_and_classifies(self):
        data = nba.transform(make_raw([_inj("2913", "Player 29-13", "Knee"), _inj("2912", "Player 29-12", "Rest")]), NOW)
        salaries = [p["salary"] or 0 for p in data["players"]]
        self.assertEqual(salaries, sorted(salaries, reverse=True))
        self.assertTrue(data["players"][0]["inj"]["injury"])
        self.assertFalse(data["players"][1]["inj"]["injury"])  # rest is not an injury
        self.assertIsNone(data["players"][-1]["salary"])  # two-way last
        self.assertEqual([n["headline"] for n in data["news"]], ["Star suffers torn ACL, out for season"])
        self.assertEqual(next(t for t in data["teams"] if t["abbr"] == "T00")["w"], 4)

    def test_metrics(self):
        m = nba.metrics(nba.transform(make_raw([_inj("2913", "Player 29-13", "Knee", status="Day-To-Day")]), NOW))
        self.assertEqual((m["injured"], m["out"], m["top50"], m["players"]), (1, 0, 1, 450))
        self.assertEqual(m["injured_salary"], 449_000_000)

    def test_history_tracks_days_and_recovered_players(self):
        nba.update(self.tmp, raw=make_raw([_inj("2913", "Player 29-13", "Knee", date="2026-10-25T12:00Z")]), now=NOW)
        data, hist = nba.update(self.tmp, raw=make_raw([_inj("2912", "Player 29-12", "Ankle")]),
                                now=datetime(2026, 11, 2, 9, tzinfo=timezone.utc))
        self.assertEqual([d["date"] for d in hist["days"]], ["2026-11-01", "2026-11-02"])
        self.assertEqual((hist["players"]["2913"]["first"], hist["players"]["2913"]["last"]), ("2026-10-25", "2026-11-01"))
        rec = next(p for p in data["players"] if p["id"] == "2913")
        self.assertEqual(rec["was"]["types"], ["Knee"])
        self.assertEqual((data["ever_injured"], data["tracking_since"]), (2, "2026-11-01"))
        _, hist = nba.update(self.tmp, raw=make_raw([]), now=datetime(2026, 11, 2, 15, tzinfo=timezone.utc))
        self.assertEqual(len(hist["days"]), 2)  # same day replaced

    def test_old_german_labels_are_translated(self):
        hist = {"days": [], "players": {"1": {"name": "X", "first": "2026-11-01", "last": "2026-11-01", "types": ["Knie"]}}}
        out = nba.update_history(hist, nba.transform(make_raw([]), NOW), "2026-11-02")
        self.assertEqual(out["players"]["1"]["types"], ["Knee"])

    def test_update_rejects_implausible_data(self):
        raw = make_raw([])
        raw["teams"], raw["rosters"] = raw["teams"][:5], raw["rosters"][:5]
        with self.assertRaises(SystemExit):
            nba.update(self.tmp, raw=raw, now=NOW)
        self.assertFalse((self.tmp / "injuries.json").exists())

    def test_build_site(self):
        nba.update(self.tmp / "d", raw=make_raw([_inj("2913", "Player 29-13", "Knee")]), now=NOW)
        dist = self.tmp / "dist"
        dist.mkdir()
        (dist / "index.html").write_text("<html><head><title>App</title></head><body></body></html>", encoding="utf-8")
        nba.build_site(self.tmp / "d", dist, "https://example.org/app/")
        share = (dist / "injuries" / "index.html").read_text(encoding="utf-8")
        self.assertIn("1 injured players", share)
        self.assertIn('content="https://example.org/app/og-injuries.png"', share)
        self.assertTrue((dist / "404.html").exists() and (dist / "og-injuries.png").exists())
        json.loads((dist / "data" / "history.json").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
