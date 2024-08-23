# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the React app
RUN npm run build

# Install serve globally to serve the built files
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Serve the built React app
# CMD ["npm", "start"]
CMD ["serve", "-s", "build"]
