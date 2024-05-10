# Stage 1: Build TypeScript application
FROM node:20.10.0 AS build

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# Stage 2: Run application with MySQL and Redis
FROM node:20.10.0-alpine

# Install MySQL client and Redis
RUN apk update && \
    apk add --no-cache mysql-client redis

# Set working directory inside the container
WORKDIR /app

# Copy compiled JavaScript code from the previous stage
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Expose port 7001 for the Node.js application and 6379 for Redis
EXPOSE 7001
EXPOSE 6379


# Command to run the Node.js application
CMD ["node", "./dist/index.js"]
