const morganBody = require('morgan-body');
const express = require('express');
const axios = require('axios');

const router = require('./api/router');

const app = express();
const PORT = process.env.PORT || 4000;

app.disable('x-powered-by');
app.use(express.json());
morganBody(app);

app.use((req, res, next) => {
  req.axios = axios.create({
    timeout: 1000,
    headers: {
      authorization: req.headers.authorization || '',
    },
  });
});
app.use('/api', router);
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.message);
    console.error(err.stack);

    const { response: { status = 500, data: { errors, message } = {} } = {} } = err;

    return res.status(status).json({
      status: false,
      errors: errors || [message] || [err.message],
    });
  }
});

app.listen(PORT, () => {
  console.log(`App at:\nhttp://localhost:${PORT} [${process.env.NODE_ENV}]`);
});
