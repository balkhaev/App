const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const dotenv = require('dotenv');
const passport = require('passport');
const expressValidator = require('express-validator');

dotenv.load();

const router = require('./router');
const app = express();

app.set('host', '0.0.0.0');
app.set('port', process.env.PORT || 8080);
app.set('json spaces', 2);
app.use(bodyParser.json());
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());

app.use(router);

app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
