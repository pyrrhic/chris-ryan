FROM node:23.5.0-alpine3.20

WORKDIR /usr/src/app

COPY ./build ./build

RUN npm install -g serve

EXPOSE 3000

ENTRYPOINT ["serve", "-s", "build", "-l", "3000"]