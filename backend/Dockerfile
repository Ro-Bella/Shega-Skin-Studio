
# Use the official Node.js 18 image as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm install

# Bundle app source
COPY . .

# Inform Docker that the container listens on port 5000 at runtime
EXPOSE 5000

# Run the app when the container launches
CMD [ "npm", "start" ]
