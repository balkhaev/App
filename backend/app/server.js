const express = require('express');
const axios = require('axios');

const app = express();

const { AUTH_SERVICE_SIGNUP_ENDPOINT, AUTH_SERVICE_LOGIN_ENDPOINT, PORT = 4000 } = process.env;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: true,
  });
});

app.post('/signup', async (req, res, next) => {
  const { data } = await axios.post(AUTH_SERVICE_SIGNUP_ENDPOINT, req.body).catch(next);

  res.json({
    status: true,
    data,
  });
});

app.post('/login', async (req, res, next) => {
  const { data } = await axios.post(AUTH_SERVICE_LOGIN_ENDPOINT, req.body).catch(next);

  res.json({
    status: true,
    data,
  });
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(err.message);
    console.error(err.stack);

    const { response: { status = 500, data: { errors, message } = {} } = {} } = err;

    return res.status(status).json({
      status: false,
      errors: errors ? errors : message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`App at:\nhttp://localhost:${PORT} - Web site`);
});
