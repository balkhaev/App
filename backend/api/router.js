const express = require('express');
const request = require('request');
const multer = require('multer');
const axios = require('axios');

const graphql = require('./graphql');

const router = express.Router();
const upload = multer({ dest: './upload', storage: multer.memoryStorage() });

const {
  SERVICE_AUTH_WEBHOOK_ENDPOINT,
  SERVICE_AUTH_SIGNUP_ENDPOINT,
  SERVICE_AUTH_LOGIN_ENDPOINT,
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

router.post('/upload', upload.single('file'), async (req, res) => {
  req.pipe(request(SERVICE_UPLOAD_ENDPOINT)).pipe(res);
});

router.get('/webhook/auth', async (req, res, next) => {
  const { data } = await axios({
    method: 'GET',
    headers: req.headers,
    url: SERVICE_AUTH_WEBHOOK_ENDPOINT,
    data: req.body,
  }).catch(e => {
    if (e.response.code === 401) {
      next(new Error('Unauthorized'));
    }

    next(e);
  });

  res.json(data);
});

router.get('/callback/file', async (req, res) => {
  console.log('body', req.body);

  const data = await graphql.request(``);

  res.json(data);
});

router.post('/callback/file', async (req, res) => {
  res.status(200).send();
});

module.exports = router;
