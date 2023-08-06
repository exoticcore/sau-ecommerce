FROM node:18.15.0
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install typescript -g
RUN npm install --omit=dev

COPY . .

RUN tsc

EXPOSE 5000
CMD [ "node", "./build/server.js"]
