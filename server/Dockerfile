# Use Node.js as base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the server code
COPY . .

# Expose the port your server runs on (change if not 3000)
EXPOSE 3000

# Command to start your server
CMD ["npm", "start"]
