# Stage 1: Build TypeScript application
FROM node:20.10.0 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install additional dependencies
RUN apt-get update && apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb

# Cleanup to reduce image size (optional but recommended)
# RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the rest of the application files
COPY . .

# Build the TypeScript application
RUN npm run build

# Stage 2: Create .env file
FROM node:20.10.0 AS env

# Set the working directory
WORKDIR /app

# Create the .env file
RUN echo "DB_NAME=irechargedb" >> .env \
    && echo "DB_USER=postgres" >> .env \
    && echo "DB_PASS=password" >> .env \
    && echo "DB_HOST=postgres" >> .env \
    && echo "PORT=7001" >> .env \
    && echo "jwtkey=irecharge-df354a95-d41b-d6a8-9eff-e13613a1f7f4" >> .env \
    && echo "HOST=localhost" >> .env

# Stage 3: Final stage
FROM node:20.10.0 AS final

# Set the working directory
WORKDIR /app

# Copy the .env file from the env stage
COPY --from=env /app/.env ./

# Copy the built application from the build stage
COPY --from=build /app/dist ./dist

# Expose the port the app runs on
EXPOSE 7001

# Command to run the application
CMD ["npm", "test"]