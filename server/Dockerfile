FROM node:12.16.3-alpine

WORKDIR /affordable/core
COPY core/package.json .
RUN yarn install

WORKDIR /affordable/server
COPY server/package.json .
RUN yarn install

WORKDIR /affordable
COPY core/dist/ ./core/dist
COPY server/dist/ ./server/dist

EXPOSE 4000

WORKDIR /affordable/server
ENTRYPOINT node ./dist/init.js