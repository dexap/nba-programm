# NBA Injury Report – setup & operations

Part of the NBA H2H React/Vite app: the `/injuries` page with its daily data backend.

Live: https://dexap.github.io/nba-programm/ · Injury report: https://dexap.github.io/nba-programm/injuries/

## Injury report

Every team and player sorted by 2026-27 salary, injured players greyed out, with key figures (injured salary, top earners out, trend, body parts) and the latest injury news.

- **Backend:** `backend/build.py` (Python standard library only) pulls rosters, contracts, the injury report, standings and news from ESPN's public JSON endpoints. ESPN only reports the *current* injury list, so the backend keeps its own history (`history.json`: daily metrics + every player ever listed as injured).
- **Storage:** branch `injury-data` (`injuries.json`, `history.json`), created on the first workflow run from `backend/seed/`.
- **Frontend:** `src/pages/Injuries.jsx` reads `data/injuries.json` and `data/history.json`. `/injuries/index.html` is generated with its own share preview (title, description with current numbers, `og-injuries.png`).

```bash
python3 backend/build.py update --data-dir DIR                 # fetch sources into DIR
python3 backend/build.py site --data-dir DIR --dist dist      # copy data into a built app
python3 -m unittest discover -s backend                       # tests (offline)

# local development with the seed data
mkdir -p public/data && cp backend/seed/*.json public/data/
npm run dev   # → http://localhost:5173/injuries
```

## Deployment (home server)

`.github/workflows/deploy.yml` runs daily (~11:41 CET), on every push to `main` and manually. **All jobs run on the home server** (self-hosted runner, label `homeserver`): tests → update injury data → `npm ci && npm run build` → GitHub Pages.

One-time setup:

1. **Register the runner** – GitHub: *Settings → Actions → Runners → New self-hosted runner*, copy the token, then on the home server:
   ```bash
   bash scripts/setup-homeserver-runner.sh <TOKEN>
   ```
   (Runners of a personal account belong to a single repository, so this adds a second runner next to the one for `dexap/angebote`.)
2. **Enable Pages** – *Settings → Pages → Build and deployment → Source: GitHub Actions*.
3. Start the workflow: *Actions → Build & deploy → Run workflow* (or push to `main`).

The previous Firebase hosting (`firebase.json`) still works with `npm run build && firebase deploy` (base path `/`).
