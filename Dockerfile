# ---------- Stage 1: Build the frontend ----------
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV VITE_API_URL=""
RUN npm run build

# ---------- Stage 2: API (json-server) ----------
FROM node:20-alpine AS api

WORKDIR /app
RUN npm install -g json-server@1

COPY db.json /app/db.json.default
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["json-server", "db.json", "--host", "0.0.0.0", "--port", "3000"]

# ---------- Stage 3: Caddy (static files + reverse proxy) ----------
FROM caddy:2-alpine AS caddy

COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
