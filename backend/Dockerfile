# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of the application source code
COPY . .

# Your app binds to port 5000, so you need to expose it
EXPOSE 5000

# Command to run the application
CMD [ "node", "server.js" ]