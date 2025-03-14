FROM node:20-alpine

WORKDIR /app

COPY apps/server/package*.json ./

RUN npm install

COPY apps/server .

EXPOSE 4000

CMD ["npm", "run", "dev"] 