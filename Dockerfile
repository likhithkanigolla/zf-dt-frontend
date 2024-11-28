FROM node:16-alpine as build

WORKDIR /app
COPY . .
RUN npm install

#COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY start.sh /start.sh
EXPOSE 80
CMD ["/bin/sh", "/start.sh"]