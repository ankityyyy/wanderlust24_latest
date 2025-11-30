FROM node:22-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci

COPY . .

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache curl

COPY --from=builder /build ./
RUN npm prune --omit=dev

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:8080/docker || exit 1


EXPOSE 8080
CMD ["node", "app.js"]
