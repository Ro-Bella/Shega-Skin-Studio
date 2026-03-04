# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /app

# --- Security: Create a non-root user ---
# Create a system user and group named 'node' in one command.
# -S: system user, -D: no password, -H: no home directory
RUN adduser -S -D -H node

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# --- Reliability: Install PM2 for process management ---
RUN npm install pm2 -g

# Copy the rest of the application source code
COPY . .

# Change the owner of the directory to the non-root user
RUN chown -R node:node /app

# Switch to the non-root user
USER node

# Your app binds to port 5000, so you need to expose it
EXPOSE 5000

# Command to run the application using PM2
CMD [ "pm2-runtime", "server.js" ]