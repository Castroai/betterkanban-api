# Use an official Node.js runtime as the base image
FROM node:alpine


# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./



# generated prisma files
COPY prisma ./prisma/

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# COPY
COPY . .


# Install dependencies
RUN npm install

RUN npx prisma generate


# Build the TypeScript code
RUN npm run build

# Expose the port on which your Express.js application listens
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
