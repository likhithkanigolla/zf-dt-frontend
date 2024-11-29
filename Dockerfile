# Build stage
FROM node:16-alpine as build

WORKDIR /app
COPY . .
ENV PUBLIC_URL=/dt_waternetwork
RUN npm install
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/build/ /usr/share/nginx/html/dt_waternetwork/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
