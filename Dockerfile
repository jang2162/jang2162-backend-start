FROM node:16

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

CMD npm start
EXPOSE 4200
