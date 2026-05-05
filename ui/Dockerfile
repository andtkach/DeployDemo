FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY index.html vite.config.js ./
COPY src ./src

ARG VITE_API_BASE_URL=http://localhost:3031
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.d/10-config.sh /docker-entrypoint.d/10-config.sh
RUN sed -i 's/\r$//' /docker-entrypoint.d/10-config.sh \
  && chmod +x /docker-entrypoint.d/10-config.sh

EXPOSE 80
