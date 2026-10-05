#!/usr/bin/env bash
# Pull origin/main on the VPS, rebuild Next.js, restart systemd.
# See deploy/VPS-STAGING.md and PROJECT-HANDBOOK.md.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ -f "${ROOT_DIR}/.env" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "${ROOT_DIR}/.env"
  set +a
fi

VPS_HOST="${VPS_HOST:-root@145.223.88.74}"
APP_DIR="${VPS_APP_DIR:-/var/www/sites/sgphilippoart}"
GIT_REMOTE="${VPS_GIT_REMOTE:-https://github.com/HostylerWeb/sgphilippoart.git}"

REMOTE_SCRIPT=$(cat <<'EOF'
set -euo pipefail
cd "$APP_DIR"
sudo -u hostyler git -c safe.directory="$APP_DIR" fetch "$GIT_REMOTE" main
sudo -u hostyler git -c safe.directory="$APP_DIR" reset --hard FETCH_HEAD
sudo -u hostyler git -c safe.directory="$APP_DIR" clean -fd -e public/uploads -e .env
sudo -u hostyler pnpm install --no-frozen-lockfile
sudo -u hostyler pnpm db:migrate:deploy
sudo -u hostyler bash -lc 'set -a && source .env && set +a && pnpm exec tsx scripts/restore-artist-story-category.ts'
rm -rf .next
sudo -u hostyler NODE_ENV=production pnpm build
systemctl restart sgphilippoart
sleep 2
systemctl is-active sgphilippoart
sudo -u hostyler git -c safe.directory="$APP_DIR" rev-parse --short HEAD
EOF
)

run_ssh() {
  if [[ -n "${VPS_ROOT_PASSWORD:-}" ]] && command -v sshpass >/dev/null 2>&1; then
    SSHPASS="$VPS_ROOT_PASSWORD" sshpass -e ssh -o StrictHostKeyChecking=no -o IdentitiesOnly=yes "$VPS_HOST" "$@"
  else
    ssh -o StrictHostKeyChecking=no -o BatchMode=yes "$VPS_HOST" "$@"
  fi
}

echo "Deploying to $VPS_HOST ($APP_DIR)…"
if ! run_ssh "APP_DIR='$APP_DIR' GIT_REMOTE='$GIT_REMOTE' bash -s" <<<"$REMOTE_SCRIPT"; then
  echo ""
  echo "Deploy failed (usually SSH auth)."
  echo "  • Add your SSH key for $VPS_HOST, or"
  echo "  • Set VPS_ROOT_PASSWORD in .env (gitignored) or: VPS_ROOT_PASSWORD='…' pnpm deploy:vps"
  echo "  • Root password: Hostinger hPanel → VPS → SSH access"
  echo "See deploy/VPS-STAGING.md"
  exit 1
fi
echo "Done."
