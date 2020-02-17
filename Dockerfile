FROM node:10

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

#ENV MONGO_URI=mongodb://localhost/bootcamp-api

CMD [ "npm", "start" ]