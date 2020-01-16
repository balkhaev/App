require('elastic-apm-node').start();

const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

dotenv.config();

const router = require('./api/router');

const app = express();
const PORT = process.env.PORT || 4000;

app.disable('x-powered-by');
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  req.axios = axios.create({
    timeout: 10000,
    headers: {
      authorization: req.headers.authorization || '',
    },
  });

  next();
});
app.use('/api', router);
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.message);
    console.error(err.stack);

    return res.status(501).json({
      status: false,
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`App at:\nhttp://localhost:${PORT} [${process.env.NODE_ENV}]`);
});
