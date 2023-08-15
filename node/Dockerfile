# build image
FROM node:18.15.0-alpine as builder
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# production
FROM builder

ENV NODE_ENV production
USER node

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --production

COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/prisma ./prisma

RUN npx prisma generate

EXPOSE 5000
CMD [ "node", "build/server.js"]
