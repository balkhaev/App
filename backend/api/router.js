const express = require('express');
const multer = require('multer');
const axios = require('axios');
const graphql = require('./graphql');

const router = express.Router();
const upload = multer({ dest: './upload' });

const { SERVICE_AUTH_WEBHOOK_ENDPOINT, SERVICE_AUTH_SIGNUP_ENDPOINT, SERVICE_AUTH_LOGIN_ENDPOINT, SERVICE_GRAPHQL_ENDPOINT } = process.env;

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
  // Тут будут кастомные обработчики ошибок от сервиса и генерирование своих человеко-читаемых.

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

router.post('/upload', upload.single('file'), async (req, res, next) => {
  const readable = fs.createReadStream(req.file);

  const { data } = await axios({
    url: SERVICE_UPLOAD_ENDPOINT,
    method: 'POST',
    headers: {
      'X-PATH': 'testing/folder'
    },
    data: readable,
  });

  res.json(data);
})

router.get('/webhook/auth', async (req, res, next) => {
  const { data } = await axios({
    method: 'GET',
    headers: req.headers,
    url: SERVICE_AUTH_WEBHOOK_ENDPOINT,
    data: req.body,
  }).catch(e => {
    next(e);
  });

  res.json(data);
});

router.post('/callback/file', async (req, res, next) => {
  console.log(req.body);

  const data = await graphql(``);

  res.json(data);
});

module.exports = router;
