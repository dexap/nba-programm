"""Injury-report backend: pulls NBA rosters, salaries and injuries daily and builds the data files.

Sources (public ESPN JSON endpoints, Python standard library only):
  - Teams:            site.api.espn.com/apis/site/v2/sports/basketball/nba/teams
  - Rosters + salary: …/teams/<id>/roster   (contract.salary, season 2027 = 2026-27)
  - Injuries:         …/nba/injuries        (current state only, ESPN keeps no history)
  - Standings:        site.api.espn.com/apis/v2/sports/basketball/nba/standings
  - News:             …/nba/news

Because ESPN only reports the *current* injury list, `update` keeps its own history
(history.json): one row of metrics per day plus every player ever listed as injured
since tracking began.

  python3 backend/build.py update --data-dir DIR           # fetch sources -> DIR/injuries.json, DIR/history.json
  python3 backend/build.py site --data-dir DIR --dist dist  # copy data into the built app, add share page (offline)
"""

import argparse
import html
import json
import re
import shutil
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
API = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba"
STANDINGS = "https://site.api.espn.com/apis/v2/sports/basketball/nba/standings"
SEASON_YEAR = 2027  # ESPN labels the 2026-27 season as 2027
SEASON = "2026-27"

# Absences on the injury report that are not injuries.
NON_INJURY = {"Rest", "Personal", "Illness", "Suspension", "Not Injury Related", "League Suspension"}

NEWS_RE = re.compile(r"injur|surger|\btorn\b|\btear\b|strain|sprain|fractur|broken|sidelined|concussion|"
                     r"\bout (at least|for|indefinitely|\d)|\bmiss(es|ing)? |\bsits?\b|re-?evaluat|\bMRI\b|"
                     r"week-to-week|day-to-day", re.I)


# --------------------------------------------------------------------------- fetching

def get(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (nba-injury-board)"})
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except Exception:
            if i == tries - 1:
                raise
            time.sleep(2 ** (i + 1))


def fetch_raw():
    """All raw data from ESPN. News is optional (errors -> empty)."""
    teams = [t["team"] for t in get(f"{API}/teams")["sports"][0]["leagues"][0]["teams"]]
    with ThreadPoolExecutor(8) as ex:
        rosters = list(ex.map(lambda t: get(f"{API}/teams/{t['id']}/roster"), teams))
    try:
        news = get(f"{API}/news?limit=60")
    except Exception as e:  # pragma: no cover - network only
        print(f"Warning: news unavailable ({e})", file=sys.stderr)
        news = {"articles": []}
    return {"teams": teams, "rosters": rosters, "injuries": get(f"{API}/injuries"),
            "standings": get(STANDINGS), "news": news}


# --------------------------------------------------------------------------- transform

def athlete_id(athlete):
    for link in athlete.get("links", []):
        m = re.search(r"/id/(\d+)", link.get("href", ""))
        if m:
            return m.group(1)
    return None


def _injuries(raw):
    out = {}
    for team in raw["injuries"].get("injuries", []):
        for x in team.get("injuries", []):
            det = x.get("details") or {}
            kind = det.get("type") or "Unknown"
            out[athlete_id(x["athlete"])] = {
                "status": x.get("status", ""),
                "type": kind,
                "side": det.get("side"),
                "return": det.get("returnDate"),
                "since": (x.get("date") or "")[:10],
                "note": x.get("shortComment", ""),
                "injury": kind not in NON_INJURY,
            }
    return out


def _records(raw):
    rec = {}
    for conf in raw["standings"].get("children", []):
        for e in conf["standings"]["entries"]:
            s = {st["name"]: st.get("value") for st in e["stats"]}
            rec[e["team"]["abbreviation"]] = {"w": int(s.get("wins") or 0), "l": int(s.get("losses") or 0),
                                              "conf": conf.get("abbreviation") or conf.get("name", "")}
    return rec


def _news(raw, limit=8):
    out = []
    for a in raw["news"].get("articles", []):
        head = a.get("headline") or ""
        if a.get("type") not in ("HeadlineNews", "Story") or not NEWS_RE.search(head):
            continue
        out.append({"headline": head, "published": a.get("published", ""),
                    "url": ((a.get("links") or {}).get("web") or {}).get("href", "")})
    out.sort(key=lambda n: n["published"], reverse=True)
    return out[:limit]


def transform(raw, now):
    injuries = _injuries(raw)
    record = _records(raw)
    teams, players = [], []
    for t, roster in zip(raw["teams"], raw["rosters"]):
        abbr = t["abbreviation"]
        teams.append({
            "abbr": abbr, "name": t["displayName"],
            "color": "#" + (t.get("color") or "333333"), "alt": "#" + (t.get("alternateColor") or "999999"),
            **record.get(abbr, {"w": 0, "l": 0, "conf": ""}),
        })
        for a in roster.get("athletes", []):
            c = a.get("contract") or {}
            salary = c.get("salary") if (c.get("season") or {}).get("year") == SEASON_YEAR else None
            players.append({
                "id": a["id"], "name": a["displayName"], "team": abbr,
                "pos": (a.get("position") or {}).get("abbreviation", ""),
                "age": a.get("age"), "salary": salary or None,
                "inj": injuries.pop(a["id"], None),
            })
    if injuries:
        print(f"Note: {len(injuries)} injured players without roster match", file=sys.stderr)
    players.sort(key=lambda p: (-(p["salary"] or 0), p["name"]))
    return {
        "generated": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "injury_report_at": raw["injuries"].get("timestamp"),
        "season": SEASON,
        "teams": teams,
        "players": players,
        "news": _news(raw),
    }


def metrics(data):
    P = data["players"]
    paid = [p for p in P if p["salary"]]
    hurt = lambda p: bool(p["inj"] and p["inj"]["injury"])
    inj = [p for p in P if hurt(p)]
    games = sum(t["w"] + t["l"] for t in data["teams"]) / max(len(data["teams"]), 1)
    return {
        "players": len(P),
        "injured": len(inj),
        "out": sum(1 for p in inj if p["inj"]["status"] == "Out"),
        "injured_salary": sum(p["salary"] or 0 for p in inj),
        "payroll": sum(p["salary"] for p in paid),
        "top50": sum(1 for p in paid[:50] if hurt(p)),
        "stars": sum(1 for p in paid if p["salary"] >= 40e6 and hurt(p)),
        "games": round(games, 1),
    }


def _type(label):
    """Older history entries were stored with German labels; keep them readable."""
    return {"Knie": "Knee", "Knöchel": "Ankle", "Rücken": "Back", "Fuß": "Foot", "Wade": "Calf", "Hüfte": "Hip",
            "Oberschenkel (hinten)": "Hamstring", "Schulter": "Shoulder", "Achillessehne": "Achilles",
            "Ferse": "Heel", "Bein": "Leg", "Handgelenk": "Wrist"}.get(label, label)


def update_history(history, data, day):
    """Append the day's metrics and the injury register. `day` = ISO date (UTC)."""
    history = history or {}
    days = [d for d in history.get("days", []) if d["date"] != day]
    days.append({"date": day, **metrics(data)})
    days.sort(key=lambda d: d["date"])
    reg = history.get("players", {})
    for e in reg.values():
        e["types"] = [_type(t) for t in e.get("types", [])]
    for p in data["players"]:
        j = p["inj"]
        if not (j and j["injury"]):
            continue
        first = min(day, j["since"] or day)
        e = reg.setdefault(p["id"], {"name": p["name"], "first": first, "types": []})
        e.update(name=p["name"], team=p["team"], salary=p["salary"], last=day, first=min(e["first"], first))
        if j["type"] not in e["types"]:
            e["types"].append(j["type"])
    return {"season": data["season"], "since": days[0]["date"], "days": days, "players": reg}


def annotate(data, history):
    """Mark recovered players (injured earlier according to the register, healthy today)."""
    reg = history.get("players", {})
    for p in data["players"]:
        e = reg.get(p["id"])
        if e and not (p["inj"] and p["inj"]["injury"]):
            p["was"] = {"first": e["first"], "last": e["last"], "types": e["types"]}
    data["tracking_since"] = history.get("since")
    data["ever_injured"] = len(reg)
    return data


# --------------------------------------------------------------------------- output

def share_description(data):
    m = metrics(data)
    return (f"{m['injured']} injured players, ${m['injured_salary'] / 1e9:.2f}B in salary sidelined, "
            f"{m['top50']} of the 50 highest-paid players out – after {m['games']} games per team. "
            f"Every team, every salary, updated daily.")


def build_site(data_dir, dist, site_url=""):
    """Copy data into the built app and add a crawler-friendly /injuries/index.html."""
    data_dir, dist = Path(data_dir), Path(dist)
    data = json.loads((data_dir / "injuries.json").read_text(encoding="utf-8"))
    (dist / "data").mkdir(parents=True, exist_ok=True)
    for name in ("injuries.json", "history.json"):
        if (data_dir / name).exists():
            shutil.copy(data_dir / name, dist / "data" / name)
    shutil.copy(HERE / "og-injuries.png", dist / "og-injuries.png")

    page = (dist / "index.html").read_text(encoding="utf-8")
    title = "NBA Injury Report 2026-27 – Every Team, Every Salary"
    desc = html.escape(share_description(data), quote=True)
    url = site_url.rstrip("/") + "/injuries/" if site_url else ""
    image = site_url.rstrip("/") + "/og-injuries.png" if site_url else "og-injuries.png"
    tags = (f'<meta name="description" content="{desc}">'
            f'<meta property="og:type" content="website"><meta property="og:title" content="{html.escape(title)}">'
            f'<meta property="og:description" content="{desc}"><meta property="og:image" content="{image}">'
            + (f'<meta property="og:url" content="{url}">' if url else "")
            + '<meta name="twitter:card" content="summary_large_image">')
    page = re.sub(r"<title>.*?</title>", f"<title>{html.escape(title)}</title>{tags}", page, count=1, flags=re.S)
    (dist / "injuries").mkdir(exist_ok=True)
    (dist / "injuries" / "index.html").write_text(page, encoding="utf-8")
    # SPA fallback for GitHub Pages (deep links like /next-game)
    shutil.copy(dist / "index.html", dist / "404.html")


def update(data_dir, raw=None, now=None):
    data_dir = Path(data_dir)
    now = now or datetime.now(timezone.utc)
    data = transform(raw or fetch_raw(), now)
    if len(data["teams"]) != 30 or len(data["players"]) < 300:
        raise SystemExit(f"Implausible data ({len(data['teams'])} teams, {len(data['players'])} players) – aborted")
    hist_path = data_dir / "history.json"
    history = json.loads(hist_path.read_text(encoding="utf-8")) if hist_path.exists() else {}
    history = update_history(history, data, now.strftime("%Y-%m-%d"))
    annotate(data, history)
    data_dir.mkdir(parents=True, exist_ok=True)
    dump = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
    (data_dir / "injuries.json").write_text(dump(data), encoding="utf-8")
    hist_path.write_text(dump(history), encoding="utf-8")
    m = metrics(data)
    print(f"{m['players']} players, {m['injured']} injured, {len(history['days'])} days of history, "
          f"{len(history['players'])} players in register -> {data_dir}")
    return data, history


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    sub = p.add_subparsers(dest="cmd", required=True)
    u = sub.add_parser("update", help="fetch sources, update injuries.json + history.json")
    u.add_argument("--data-dir", required=True)
    s = sub.add_parser("site", help="copy data into the built app (offline)")
    s.add_argument("--data-dir", required=True)
    s.add_argument("--dist", default="dist")
    s.add_argument("--site-url", default="", help="public base URL, e.g. https://dexap.github.io/nba-programm")
    args = p.parse_args(argv)
    if args.cmd == "update":
        update(args.data_dir)
    else:
        build_site(args.data_dir, args.dist, args.site_url)


if __name__ == "__main__":
    main()
