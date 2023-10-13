FROM node:18-alpine

ENV NODE_ENV development

WORKDIR /app

COPY . .

COPY package.json ./
RUN npm install

CMD [ "node", "app.js" ]

EXPOSE 8080

