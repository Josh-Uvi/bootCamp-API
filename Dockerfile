FROM node:10

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production && npm cache clean --force

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]