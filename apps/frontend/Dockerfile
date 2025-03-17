FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app/apps/frontend
RUN ls -la && \
    npm run build && \
    ls -la

FROM node:20-alpine
WORKDIR /app/apps/frontend
# Copy the frontend's package.json to the current working directory
COPY apps/frontend/package.json ./
COPY package*.json ../../
COPY packages/shared/package.json ../../packages/shared/
RUN npm install
# Copy the build output
COPY --from=build-env /app/apps/frontend/build ./build
CMD ["npm", "run", "start"]