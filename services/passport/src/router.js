const express = require('express');

const passport = require('./passport');
const User = require('./db/userSchema');
const { errorHandler } = require('./db/errors');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({ errors: errors });
  }

  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return handleResponse(res, 400, { error: err });
    }

    if (user) {
      const response = await user.getUser();

      handleResponse(res, 200, response);
    }
  })(req, res, next);
});

router.post('/signup', async (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('username', 'Username is not valid').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
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

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return handleResponse(res, 400, { error: err });
    }

    if (user) {
      handleResponse(res, 200, user.getUser());
    }
  })(req, res, next);
});

const hasuraUA = 'hasura-graphql-engine/v1.0.0';

router.get('/webhook', async (req, res, next) => {
  if (req.headers['user-agent'] === hasuraUA && req.headers['x-hasura-role']) {
    handleResponse(res, 200, { 'X-Hasura-Role': req.headers['x-hasura-role'] });
  } else {
    passport.authenticate('bearer', (err, user, info) => {
      if (err) {
        return handleResponse(res, 401, { error: err });
      }

      if (user) {
        const { id, role = 'user' } = user;

        handleResponse(res, 200, {
          'X-Hasura-Role': role,
          'X-Hasura-User-Id': id,
        });
      } else {
        handleResponse(res, 200, { 'X-Hasura-Role': 'anonymous' });
      }
    })(req, res, next);
  }
});

function handleResponse(res, code, statusMsg) {
  res.status(code).json(statusMsg);
}

module.exports = router;
