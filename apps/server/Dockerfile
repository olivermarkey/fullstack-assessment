FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/
COPY packages/shared/package*.json ./packages/shared/

# Copy source files
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server

# Install dependencies
RUN npm ci

WORKDIR /app/apps/server
# Copy the server's package.json to the current working directory
COPY apps/server/package.json ./
CMD ["npm", "run", "start"] 