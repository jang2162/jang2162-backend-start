FROM node:16

RUN ls -al /app

WORKDIR /app
COPY . /app

RUN ls -al /app

RUN npm install
RUN npm run build

CMD npm start
EXPOSE 4200
