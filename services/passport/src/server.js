require('elastic-apm-node').start();

const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const passport = require('passport');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

dotenv.load();
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

const router = require('./router');
const app = express();

app.set('host', '0.0.0.0');
app.set('port', process.env.PORT || 8080);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('[:user-agent] :method :url - code :status (:response-time ms) - :body'));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());
app.use(cors());
app.use(router);

module.exports = app;
