FROM node:16

WORKDIR /app
COPY . /app

CMD npm start
EXPOSE 4200
