# Specify the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the desired port
EXPOSE 3000

# Start the Express.js server
CMD [ "npm", "start" ]
