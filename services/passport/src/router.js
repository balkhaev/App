const express = require('express');

const User = require('./db/userSchema');
const passport = require('./passport');
const { errorHandler } = require('./db/errors');

const { HASURA_UA, ANONYMOUS, ADMIN_ROLE, USER_ROLE } = require('./config.json');

const router = express.Router();

const handleResponse = (res, code, statusMsg) => {
  res.status(code).json(statusMsg);
};

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
      handleResponse(res, 200, await user.getUser());
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

  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return handleResponse(res, 400, { error: err });
    }

    if (user) {
      handleResponse(res, 200, await user.getUser());
    }
  })(req, res, next);
});

router.get('/me', (req, res, next) => {
  passport.authenticate('bearer', async (err, user) => {
    if (err) {
      return handleResponse(res, 401, { error: err });
    }

    if (user) {
      handleResponse(res, 200, await user.getUser());
    } else {
      handleResponse(res, 200, ANONYMOUS);
    }
  })(req, res, next);
});

/**
 * Hasura webhook
 *
 * Ожидает код 200 или 401.
 * При 200 ответе в теле можно передать дополнительные заголовки для схемы привелегий.
 */
router.get('/webhook', async (req, res, next) => {
  const {
    headers: { userAgent, xHasuraRole = ADMIN_ROLE },
  } = req;

  if (userAgent === HASURA_UA) {
    // Hasura admin interface
    return handleResponse(res, 200, {
      'X-Hasura-Role': xHasuraRole,
    });
  }

  passport.authenticate('bearer', async (err, user) => {
    if (err) {
      return handleResponse(res, 401, { error: err });
    }

    if (user) {
      const { id, company_id, role = USER_ROLE } = await user.getUser();

      handleResponse(res, 200, {
        'X-Hasura-User-Company-Id': `${company_id}`,
        'X-Hasura-User-Id': `${id}`,
        'X-Hasura-Role': `${role}`,
      });
    } else {
      handleResponse(res, 200, {
        'X-Hasura-Role': ANONYMOUS.role,
      });
    }
  })(req, res, next);
});

module.exports = router;
