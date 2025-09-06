# -------- Build stage --------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy the rest of the source and build
COPY . .
RUN npm run build

# -------- Runtime stage --------
FROM nginx:1.27-alpine

# Copy the built Angular artifacts to NGINX html directory
COPY --from=build /app/dist/webapp/browser /usr/share/nginx/html

# Replace the default NGINX site config with SPA-friendly config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
