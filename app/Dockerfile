FROM node:12.16.3-alpine

WORKDIR /affordable/app
RUN npm install express path dotenv ejs serve-favicon

COPY build/ ./build
COPY server.js .

EXPOSE 3000

ENTRYPOINT node ./server.js