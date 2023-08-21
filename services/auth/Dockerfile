# build image
FROM node:18.15.0 as builder
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# production
FROM node:18.15.0

ENV NODE_ENV production
USER node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/build ./build

EXPOSE 5000
CMD [ "node", "build/server.js"]


# multiplatform
# export DOCKER_CLI_EXPERIMENTAL=enabled
# docker run --rm --privileged docker/binfmt:66f9012c56a8316f9244ffd7622d7c21c1f6f28d
# docker buildx create --use --name multi-arch-builder
# docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t doublecore/auth-app:latest --push .