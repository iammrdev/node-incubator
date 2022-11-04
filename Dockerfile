FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY nodemon.json ./

RUN yarn

COPY . .