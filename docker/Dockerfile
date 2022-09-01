FROM node:16

WORKDIR /app
COPY . /app
RUN npm install -g turbo
RUN npm install
RUN npm run build
