FROM node:16

WORKDIR /usr/todo

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3033
CMD [ "npm", "start" ]