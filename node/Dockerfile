# build image
FROM node:18.15.0 as builder
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# production
FROM node:18.15.0-alpine

ENV NODE_ENV production
USER node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --production

COPY --from=builder /usr/src/app/build ./build

EXPOSE 5000
CMD [ "node", "build/server.js"]
