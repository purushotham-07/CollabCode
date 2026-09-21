FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Replace default nginx config to serve on port 3000 and handle SPA routing
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY <<EOF /etc/nginx/conf.d/frontend.conf
server {
    listen 3000;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

COPY --from=builder /app/dist .

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
