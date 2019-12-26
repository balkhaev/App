const express = require('express');
const axios = require('axios');

const router = express.Router();

const {
  SERVICE_AUTH_WEBHOOK_ENDPOINT,
  SERVICE_AUTH_SIGNUP_ENDPOINT,
  SERVICE_AUTH_LOGIN_ENDPOINT,
} = process.env;

router.use('/', express.static('./admin/build'));

router.post('/signup', async (req, res, next) => {
  const { data } = await axios.post(SERVICE_AUTH_SIGNUP_ENDPOINT, req.body)
    .catch(e => {
      next(e);
    });
    // Тут будут кастомные обработчики ошибок от сервиса и генерирование своих человеко-читаемых.

  res.json({
    status: true,
    data,
  });
});

router.post('/login', async (req, res, next) => {
  const { data } = await axios.post(SERVICE_AUTH_LOGIN_ENDPOINT, req.body).catch(e => {
    next(e);
  });

  res.json({
    status: true,
    data,
  });
});

router.get('/webhook', async (req, res, next) => {
  const { data } = await axios.get(SERVICE_AUTH_WEBHOOK_ENDPOINT, req.body).catch(e => {
    next(e);
  });

  res.json(data);
});

module.exports = router;
