FROM node:16

WORKDIR /app
RUN ls -al /app
COPY . /app

RUN ls -al /app

RUN npm install
RUN npm run build

CMD npm start
EXPOSE 4200
