FROM node:18.15.0-alpine
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN tsc

EXPOSE 5000
CMD [ "npm", "start"]
