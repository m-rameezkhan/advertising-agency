FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/ai-service/package.json ./apps/ai-service/package.json

RUN npm install

COPY . .

WORKDIR /app/apps/ai-service

EXPOSE 4010

CMD ["npm", "run", "start"]
