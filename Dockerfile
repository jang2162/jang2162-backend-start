FROM node:16

WORKDIR /app
COPY . /app

RUN pwd
RUN ls -al

RUN npm install
RUN npm run build

CMD npm start
EXPOSE 3000
