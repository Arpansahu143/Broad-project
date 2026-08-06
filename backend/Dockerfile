# --- Stage 1: install dependencies (needs build tools for native bcrypt) ---
FROM node:20-alpine AS deps

WORKDIR /app

# bcrypt is a native module and needs a compiler toolchain to build
# inside Alpine's minimal image.
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# --- Stage 2: runtime image ---
FROM node:20-alpine AS runtime

WORKDIR /app

# wget is needed by the healthcheck defined in docker-compose.yml
RUN apk add --no-cache wget

# Run as a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY src ./src

# Generates the Prisma client for THIS container's platform —
# avoids the Windows-vs-Linux native binary mismatch entirely,
# since this runs fresh inside the Linux image every build.
RUN npx prisma generate

RUN mkdir -p logs && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

# docker-compose.yml overrides this with its own `command:` (runs
# `prisma migrate deploy` first) — this CMD is the fallback if run
# standalone without that override.
CMD ["node", "src/server.js"]
