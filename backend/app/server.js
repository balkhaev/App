const express = require('express');

const router = require('./router');

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: true,
    path: 'root',
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
      errors: errors ? errors : message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`App at:\nhttp://localhost:${PORT} - Web site`);
});
