# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production
RUN cd client && npm ci --only=production

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 4000

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["npm", "start"]