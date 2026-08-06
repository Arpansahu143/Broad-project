# --- Stage 1: build the static Vite app ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite only bakes import.meta.env.VITE_* values in at build time, so
# this must be an ARG turned into an ENV before `npm run build` runs —
# setting it later (e.g. at container start) would have no effect.
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- Stage 2: serve the built files via nginx ---
FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
