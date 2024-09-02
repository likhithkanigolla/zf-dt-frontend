# Use an official Node.js image as the base image
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight web server to serve the built files
FROM nginx:stable-alpine

# Copy the build files to the nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom nginx configuration file if you need one
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port that nginx will run on
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
