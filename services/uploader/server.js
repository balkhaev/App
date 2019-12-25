const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4073;

app.use(cors({
  credentials: true,
  origin: true,
}));
app.use(morgan('tiny'));
app.use(express.json());

app.disable('x-powered-by');

app.use(require('./router'));

app.listen(PORT, () => {
  console.log(`App at http://localhost:${PORT}`);
})
