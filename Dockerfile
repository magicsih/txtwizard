# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json vite.config.ts svelte.config.js ./

RUN npm install

COPY ./src ./src
COPY ./static ./static

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

# 10. Nginx 실행
CMD ["nginx", "-g", "daemon off;"]

# 11. 기본적으로 80 포트 개방 (옵션)
EXPOSE 80