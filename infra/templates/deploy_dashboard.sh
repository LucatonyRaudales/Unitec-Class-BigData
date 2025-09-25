#!/bin/bash
# Next.js + PM2 + Nginx en Amazon Linux 2023
set -euxo pipefail

APP_ROOT="/opt/dashboard"
REPO_URL="https://github.com/LucatonyRaudales/Unitec-Class-BigData.git"
NODE_MAJOR=20
PM2_USER="root"
PM2_HOME_DIR="/root"

# 1) Sistema y runtimes
dnf update -y
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs git nginx jq

npm i -g pm2

# 2) Código
mkdir -p "${APP_ROOT}"
cd "${APP_ROOT}"
if [ ! -d .git ]; then
  git clone "${REPO_URL}" .
else
  git fetch --all && git reset --hard origin/HEAD
fi

# 3) Detectar subcarpeta del Next.js
if [ -d "${APP_ROOT}/dashboard" ]; then
  APP_DIR="${APP_ROOT}/dashboard"
elif [ -d "${APP_ROOT}/cyber-dashboard" ]; then
  APP_DIR="${APP_ROOT}/cyber-dashboard"
else
  # si está en la raíz
  APP_DIR="${APP_ROOT}"
fi

cd "${APP_DIR}"

# 4) Asegurar scripts Next
if [ -f package.json ]; then
  # set "start" = "next start -p 3000"
  if command -v jq >/dev/null 2>&1; then
    tmp="$(mktemp)"
    jq '.scripts.start="next start -p 3000" | .scripts.build= (.scripts.build // "next build")' package.json > "$tmp" && mv "$tmp" package.json
  else
    sed -i 's/"start".*:.*"/"start":"next start -p 3000"/' package.json || true
  fi
else
  echo "No package.json en ${APP_DIR}" >&2
  exit 1
fi

# 5) Dependencias y build
npm ci || npm install
npm run build

# 6) PM2 (persistente con systemd)
# mata proceso previo si existiera
pm2 delete dashboard || true
# arranca en el directorio de la app
pm2 start "npm start" --name dashboard --cwd "${APP_DIR}"
pm2 save

# Configurar startup para el usuario seleccionado
pm2 startup systemd -u "${PM2_USER}" --hp "${PM2_HOME_DIR}" -k
# el comando anterior imprime una línea "sudo env PATH=... pm2 resurrect" interna; forzamos enable:
systemctl enable pm2-${PM2_USER}

# 7) Nginx (reverse proxy + health)
cat >/etc/nginx/conf.d/dashboard.conf <<'NGINX'
server {
    listen 80;
    server_name _;

    # Health check para el ALB
    location = /health {
        access_log off;
        add_header Content-Type text/plain;
        return 200 'ok';
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
NGINX

rm -f /etc/nginx/conf.d/default.conf || true
nginx -t
systemctl enable --now nginx

# 8) Firewall (si firewalld está activo)
if systemctl is-active --quiet firewalld; then
  firewall-cmd --permanent --add-service=http || true
  firewall-cmd --permanent --add-service=https || true
  firewall-cmd --reload || true
fi

# 9) Comprobaciones rápidas
ss -ltnp | egrep ':80|:3000' || true
curl -sSf http://127.0.0.1/health >/dev/null
