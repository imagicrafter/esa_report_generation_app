# Use the official Node.js runtime as a parent image
FROM node:18-alpine

# Add security updates
RUN apk update && apk upgrade

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Define environment variable for port
ENV PORT=8080

# Command to run the application
CMD ["npm", "start"]