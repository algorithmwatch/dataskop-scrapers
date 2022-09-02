FROM node:16
ARG NPM_GITHUB_AUTH

WORKDIR /app
COPY . /app
RUN echo "//npm.pkg.github.com/:_authToken=$NPM_GITHUB_AUTH" >>.npmrc
RUN npm install -g turbo
RUN npm install
RUN npm run build
