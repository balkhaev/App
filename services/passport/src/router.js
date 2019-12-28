const express = require('express');

const { HASURA_UA, ANONYMOUS, ADMIN_ROLE, USER_ROLE } = require('./config.json');
const { errorHandler } = require('./db/errors');
const User = require('./db/userSchema');
const passport = require('./passport');
const webhooks = require('./webhooks');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({ errors: errors });
  }

  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    if (user) {
      res.json(await user.getUser());
    }
  })(req, res, next);
});

router.post('/signup', async (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('username', 'Username is not valid').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(8);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({ errors: errors });
  }

  try {
    await User.query()
      .allowInsert('[username, password, email]')
      .insert({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      });
  } catch (err) {
    errorHandler(err, res);
    return;
  }

  passport.authenticate('local', async (err, user) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    if (user) {
      res.json(await user.getUser());
    }
  })(req, res, next);
});

router.get('/me', (req, res, next) => {
  passport.authenticate('bearer', async (err, user) => {
    if (err) {
      return res.status(401).json({ error: err });
    }

    if (user) {
      res.json(await user.getUser());
    } else {
      res.json(ANONYMOUS);
    }
  })(req, res, next);
});

/**
 * Hasura webhook.
 *
 * Ожидает статус код 200 или 401 и заголовок "X-Hasura-Role" с ролью пользователя.
 * При 200 ответе можно в теле JSON'ом передать дополнительные заголовки для схемы привелегий.
 *
 * Всем данным Hasura на доверяет 100%... так что не подведи ее.
 */
router.get('/webhook/hasura', webhooks.hasura({
  hasuraUa: HASURA_UA,
  anonymousRole: ANONYMOUS.role,
  adminRole: ADMIN_ROLE,
  userRole: USER_ROLE
}));

module.exports = router;
