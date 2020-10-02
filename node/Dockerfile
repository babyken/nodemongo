FROM node:10-alpine

WORKDIR /usr/app
# COPY package*.json ./
# RUN npm install --quiet
RUN npm install -g nodemon
# Added wait script for mongo DB
COPY wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh
# node alpine version doesn't have bash
RUN apk add --no-cache bash
# COPY . .