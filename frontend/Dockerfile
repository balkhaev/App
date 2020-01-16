# = NODE BUILD =
FROM node:13.5.0-alpine3.11

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --registry http://verdaccio.mvs.wtf/

COPY . .

RUN npm run build

CMD [ "npm", "start" ]
