# Use an official Node.js image to build the React app
FROM node:16-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Serve the React app using an nginx server
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000
