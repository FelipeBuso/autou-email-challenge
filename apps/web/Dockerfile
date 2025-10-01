FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/

RUN pnpm install --frozen-lockfile

COPY apps/web ./apps/web

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /app/apps/web
RUN pnpm build


FROM node:22-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/apps/web/dist ./dist

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
