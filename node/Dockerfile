FROM node:18.15.0
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production --no-optional && tsc

COPY . .

EXPOSE 5000
CMD [ "node", "./build/server.js"]