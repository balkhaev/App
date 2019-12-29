const express = require('express');
const proxy = require('http-proxy-middleware');
const axios = require('axios');

const graphql = require('./graphql');

const router = express.Router();

const {
  SERVICE_AUTH_HASURA_WEBHOOK_ENDPOINT,
  SERVICE_AUTH_SIGNUP_ENDPOINT,
  SERVICE_AUTH_LOGIN_ENDPOINT,
  SERVICE_GRAPHQL_ENDPOINT,
  SERVICE_UPLOAD_ENDPOINT,
} = process.env;

router.use('/', express.static('./admin/build'));

router.post('/signup', async (req, res, next) => {
  const { data } = await axios({
    url: SERVICE_AUTH_SIGNUP_ENDPOINT,
    method: 'POST',
    headers: req.headers,
    data: req.body,
  }).catch(e => {
    next(e);
  });
  // Тут будут кастомные обработчики ошибок от сервиса c генерировацией человеку-понятных новых.

  res.json(data);
});

router.post('/login', async (req, res, next) => {
  const { data } = await axios({
    url: SERVICE_AUTH_LOGIN_ENDPOINT,
    method: 'POST',
    headers: req.headers,
    data: req.body,
  }).catch(e => {
    next(e);
  });

  res.json(data);
});

router.post('/graphql', async (req, res, next) => {
  const { data } = await req.axios({
    url: SERVICE_GRAPHQL_ENDPOINT,
    method: 'POST',
    data: req.body,
  }).catch(e => {
    console.log(e);
    next(e);
  });

  res.json(data);
});

router.use(
  '/upload',
  proxy({
    toProxy: SERVICE_UPLOAD_ENDPOINT,
    target: SERVICE_UPLOAD_ENDPOINT,
    followRedirects: true,
    changeOrigin: true,
    ignorePath: true,
  })
);

router.get('/webhook/hasura', async (req, res, next) => {
  const { data } = await req.axios({
    url: SERVICE_AUTH_HASURA_WEBHOOK_ENDPOINT,
    method: 'GET',
    data: req.body,
  }).catch(e => {
    const { response: { code } = {} } = e;

    if (code === 401) {
      next(new Error('Unauthorized'));
    }

    next(e);
  });

  res.json(data);
});

router.get('/callback/tusd', async (req, res) => {
  console.log('body', req.body);

  const data = await graphql.request(``);

  res.json({ data });
});

router.post('/callback/tusd', async (req, res) => {
  const { Upload, HTTPRequest } = req.body;

  console.log({ Upload, HTTPRequest });

  if (!Upload) {
    res.status(500).json({ status: false });
    return;
  }

  res.status(200).send();
});

module.exports = router;
