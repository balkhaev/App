const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: true,
    path: 'api',
  });
});

router.post('/signup', async (req, res, next) => {
  const { data } = await axios.post(AUTH_SERVICE_SIGNUP_ENDPOINT, req.body).catch(next);

  res.json({
    status: true,
    data,
  });
});

router.post('/login', async (req, res, next) => {
  const { data } = await axios.post(AUTH_SERVICE_LOGIN_ENDPOINT, req.body).catch(next);

  res.json({
    status: true,
    data,
  });
});

module.exports = router;
