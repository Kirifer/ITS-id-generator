# Use official Node LTS
FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install only production deps
RUN npm install --production

# Copy the rest of the source
COPY . .

# Ensure uploads folder exists (for legacy local storage)
RUN mkdir -p uploads/generated uploads/photos

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
