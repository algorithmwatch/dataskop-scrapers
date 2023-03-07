FROM node:18
ARG NPM_GITHUB_AUTH

RUN apt-get update
RUN apt-get install -y curl

WORKDIR /app
COPY . /app
RUN echo "//npm.pkg.github.com/:_authToken=$NPM_GITHUB_AUTH" >>.npmrc
RUN npm install -g turbo@1.7
RUN npm install
RUN npm run build
