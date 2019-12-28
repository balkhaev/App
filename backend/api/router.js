const { Readable } = require('stream');
const express = require('express');
const request = require('request');
const multer = require('multer');
const axios = require('axios');

const graphql = require('./graphql');

const upload = multer({ dest: './upload', storage: multer.memoryStorage() });
const router = express.Router();

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
  req.pipe(request(SERVICE_UPLOAD_ENDPOINT)).pipe(res);

  /*
  const upload = new tus.Upload(req.file.buffer, {
    endpoint: SERVICE_UPLOAD_ENDPOINT,
    retryDelays: [0, 3000, 5000, 10000, 20000],
    uploadSize: req.file.size,
    metadata: {
      filename: req.file.originalname,
      filetype: req.file.mimetype,
    },
    onError: function(error) {
      console.log('Failed because: ' + error);
    },
    onProgress: function(bytesUploaded, bytesTotal) {
      var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);

      console.log(bytesUploaded, bytesTotal, percentage + '%');
    },
    onSuccess: function() {
      console.log('Download %s from %s', upload.file.name, upload.url);
    },
  });

  upload.start();
  */

  // res.json({
  //   status: 'Upload in progress',
  // });
});

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

router.get('/callback/file', async (req, res, next) => {
  console.log('body', req.body);

  const data = await graphql(``);

  res.json(data);
});

module.exports = router;
