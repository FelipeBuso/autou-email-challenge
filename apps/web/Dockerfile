# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Instala pnpm globalmente
RUN npm install -g pnpm

# Copia apenas arquivos de lock e package.json
COPY package.json pnpm-lock.yaml ./

# Instala dependências
RUN pnpm install

# Copia todo o projeto
COPY . .

# Build da aplicação
RUN pnpm build

# Stage 2: Serve a build com 'serve'
FROM node:20-alpine AS production

WORKDIR /app

# Instala serve globalmente
RUN npm install -g serve

# Copia a build do estágio anterior
COPY --from=build /app/dist ./dist

# Expõe a porta
EXPOSE 5173

# Comando para servir a build
CMD ["serve", "-s", "dist", "-l", "5173"]
