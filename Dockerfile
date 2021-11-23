FROM node:16

#ADD package.json /tmp/package.json
#ADD package-lock.json /tmp/package-lock.json

#RUN cd /tmp && npm install
#RUN mkdir -p /app && cp -a /tmp/node_modules /app/

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

CMD npm start
EXPOSE 4200
