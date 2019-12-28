module.exports = (passport, { hasuraUa = 'hasura-graphql-engine/v1.0.0', adminRole = 'admin', userRole, anonymousRole } = {}) => {
  if (typeof anonymousRole !== 'string') {
    throw new Error('Anonymous role required!');
  }

  if (typeof userRole !== 'string') {
    throw new Error('User role required!');
  }

  return async (req, res, next) => {
    const { userAgent, xHasuraRole = adminRole } = req.headers;

    // Hasura admin interface webhook auth check
    if (userAgent === hasuraUa) {
      return res.json({
        'X-Hasura-Role': xHasuraRole,
      });
    }

    passport.authenticate('bearer', async (error, user) => {
      if (error) {
        return res.status(401).json({ error });
      }

      if (user) {
        const { id, company_id, role = userRole } = await user.getUser();

        res.json({
          'X-Hasura-User-Company-Id': `${company_id}`,
          'X-Hasura-User-Id': `${id}`,
          'X-Hasura-Role': `${role}`,
        });
      } else {
        res.json({
          'X-Hasura-Role': anonymousRole,
        });
      }
    })(req, res, next);
  };
};
