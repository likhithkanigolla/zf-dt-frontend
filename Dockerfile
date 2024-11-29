# Stage 1: Build the React app
FROM node:14-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html/dt_waternetwork

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]