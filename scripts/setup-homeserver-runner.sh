#!/usr/bin/env bash
# See docs/injury-report.md. Registers a GitHub Actions self-hosted runner for dexap/nba-programm on the home server
# and installs it as a system service (label: homeserver).
#
#   1. GitHub: Settings → Actions → Runners → "New self-hosted runner" → copy the token
#      from the "./config.sh --url … --token XXXX" line (valid for 1 hour)
#   2. On the home server:  bash scripts/setup-homeserver-runner.sh <TOKEN>
#
# Runners of a personal account belong to one repository, so this is a second runner
# next to the one for dexap/angebote (separate directory, separate service).
# Requirements on the server: curl, tar, git, python3 (Node is installed by the workflow).
set -euo pipefail

TOKEN="${1:?usage: $0 <registration-token>}"
REPO_URL="https://github.com/dexap/nba-programm"
DIR="${RUNNER_DIR:-$HOME/actions-runner-nba-programm}"
NAME="${RUNNER_NAME:-$(hostname)-nba-programm}"

case "$(uname -m)" in
  x86_64) ARCH=x64 ;;
  aarch64 | arm64) ARCH=arm64 ;;
  armv7l) ARCH=arm ;;
  *) echo "unsupported architecture: $(uname -m)" >&2; exit 1 ;;
esac

VERSION="$(curl -fsSL https://api.github.com/repos/actions/runner/releases/latest | python3 -c 'import json,sys; print(json.load(sys.stdin)["tag_name"].lstrip("v"))')"
echo "Runner v$VERSION ($ARCH) -> $DIR"

mkdir -p "$DIR"
cd "$DIR"
if [ ! -x ./config.sh ]; then
  curl -fsSL -o runner.tar.gz "https://github.com/actions/runner/releases/download/v$VERSION/actions-runner-linux-$ARCH-$VERSION.tar.gz"
  tar xzf runner.tar.gz
  rm runner.tar.gz
fi

./config.sh --unattended --replace --url "$REPO_URL" --token "$TOKEN" \
  --name "$NAME" --labels homeserver --work _work

sudo ./svc.sh install "$(id -un)"
sudo ./svc.sh start
sudo ./svc.sh status | head -5
echo "Done – the runner should now show as 'Idle' under Settings → Actions → Runners."
