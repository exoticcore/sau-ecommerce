# Build
FROM node:18.7.1-alpine as builder

WORKDIR /app

COPY . .

RUN "yarn install"
RUN "yarn build"

# Production
FROM node:18.7.1-alpine

WORKDIR /app

COPY --from=builder ./app/dist ./dist
COPY package.json .
COPY yarn.lock .

RUN yarn install --production

EXPOSE 3000

CMD ["yarn", "start"]