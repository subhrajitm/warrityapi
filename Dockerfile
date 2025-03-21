FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Bundle app source
COPY . .

# Create logs and uploads directories
RUN mkdir -p logs uploads

# Set proper permissions
RUN chmod -R 755 logs uploads

# Expose the port the app runs on
EXPOSE 5001

# Set NODE_ENV to production
ENV NODE_ENV=production

# Run the app
CMD ["node", "src/server.js"] 