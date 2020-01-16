FROM keymetrics/pm2:12-alpine

COPY package*.json ./
COPY . .

ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

EXPOSE 4000

CMD [ "pm2-runtime", "start", "pm2.json" ]
