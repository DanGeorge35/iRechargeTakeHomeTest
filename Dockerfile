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

# Expose the port the app runs on
EXPOSE 7001


# Command to run the application
CMD ["npm", "test"]
