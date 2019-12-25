const proxy = require('express-http-proxy');
const express = require('express');
const axios = require('axios');

const router = express.Router();

const {
  SERVICE_AUTH_WEBHOOK_ENDPOINT,
  SERVICE_AUTH_SIGNUP_ENDPOINT,
  SERVICE_AUTH_LOGIN_ENDPOINT,
  SERVICE_ADMIN_ENDPOINT,
} = process.env;

router.get('/', (req, res) => {
  res.json({
    status: true,
    path: 'api',
  });
});

router.post('/signup', async (req, res, next) => {
  const { data } = await axios.post(SERVICE_AUTH_SIGNUP_ENDPOINT, req.body).catch(next);

  res.json({
    status: true,
    data,
  });
});

router.post('/login', async (req, res, next) => {
  const { data } = await axios.post(SERVICE_AUTH_LOGIN_ENDPOINT, req.body).catch(next);

  res.json({
    status: true,
    data,
  });
});

router.get('/webhook', async (req, res, next) => {
  const { data } = await axios.get(SERVICE_AUTH_WEBHOOK_ENDPOINT, req.body).catch(next);

  res.json(data);
});

router.get('/admin', proxy(SERVICE_ADMIN_ENDPOINT))

module.exports = router;
