const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const passport = require('passport');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const chalk = require('chalk');
const cors = require('cors');

dotenv.load();
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

const router = require('./router');
const app = express();

app.set('host', '0.0.0.0');
app.set('port', process.env.PORT || 8080);
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());
app.use(cors());
app.use(router);

module.exports = app;

// Запускать приложение только если его вызвали напрямую (node src/server).
// Если он установлен как NPM пакет, то просто отдаем app.
if (require.main === module) {
  app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });
}
