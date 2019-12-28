module.exports = (passport, opts = {}) => {
  const { adminRole = 'admin', userRole, anonymousRole } = opts;

  if (typeof anonymousRole !== 'string') {
    throw new Error('Anonymous role required!');
  }

  if (typeof userRole !== 'string') {
    throw new Error('User role required!');
  }

  return async (req, res, next) => {
    const {
      authorization,
      'user-agent': userAgent,
      'sec-fetch-mode': secFetchMode,
      'x-hasura-role': xHasuraRole = adminRole,
    } = req.headers;

    // Hasura admin interface
    if (secFetchMode === 'cors' && userAgent.includes('hasura-graphql-engine/')) {
      return res.json({
        'X-Hasura-Role': xHasuraRole,
      });
    }

    if (!authorization) {
      return res.json({
        'X-Hasura-Role': anonymousRole,
      });
    }

    const auth = passport.authenticate('bearer', async (error, user) => {
      if (error) {
        return res.status(401).json({ error });
      }

      if (!user) {
        return res.json({
          'X-Hasura-Role': anonymousRole,
        });
      }

      /**
       * Схема такая:
       * - Если есть пользователь, но нету роли - role === 'user'
       * - Если есть пользователь и есть роль - role === user.role
       * - Если есть пользователь и он админ - role === (x-hasura-role || user.role)
       */
      let { id, role = userRole, company_id } = await user.getUser();

      if (role === adminRole) {
        role = xHasuraRole;
      }

      res.json({
        'X-Hasura-User-Company-Id': `${company_id}`,
        'X-Hasura-User-Id': `${id}`,
        'X-Hasura-Role': `${role}`,
      });
    });

    auth(req, res, next);
  };
};
