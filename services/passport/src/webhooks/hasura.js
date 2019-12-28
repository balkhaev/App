const camelCaseToDash = str => str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
const toHeaders = (opts, prefix = '') => {
  return Object.keys(opts).reduce((acc, key) => {
    acc[prefix + camelCaseToDash(key)] = `${opts[key]}`;

    return acc;
  }, {});
};
const createHasuraHeaders = (role, userId, userCompanyId) =>
  toHeaders({ role, userId, userCompanyId }, 'x-hasura-');

/**
 * Схема авторизации такая:
 *
 * - Если x-passport-secret заголовок совпадает с секретом в .env и user-agent содержит часть Hasura юзер агента
 * - тогда - role === (x-hasura-role || "admin")
 *
 * - Если нету authorization заголовка
 * - тогда - role === 'anonymous'
 *
 * - Если есть authorization заголовок, но нету пользователя
 * - тогда - role === 'anonymous'
 *
 * - Если есть пользователь, но нету роли
 * - тогда - role === 'user'
 *
 * - Если есть пользователь и есть роль
 * - тогда - role === user.role
 *
 * - Если есть пользователь и он админ
 * - тогда - role === (x-hasura-role || user.role)
 */

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
      'x-passport-pass': xPassportPass,
      'x-hasura-role': xHasuraRole = adminRole,
    } = req.headers;

    // Hasura admin interface
    if (xPassportPass === process.env.SECRET && userAgent.includes('hasura-graphql-engine/')) {
      return res.json(createHasuraHeaders(xHasuraRole));
    }

    if (!authorization) {
      return res.json(createHasuraHeaders(anonymousRole));
    }

    passport.authenticate('bearer', async (error, user) => {
      if (error) {
        return res.status(401).json({ error });
      }

      if (!user) {
        return res.json(createHasuraHeaders(anonymousRole));
      }

      let { id, role = userRole, company_id } = await user.getUser();

      // Даем возможность админу посмотреть сайт за любого пользователя и компанию.
      if (role === adminRole) {
        const {
          'x-hasura-user-id': xHasuraUserId = id,
          'x-hasura-user-company-id': xHasuraUserCompanyId = company_id,
        } = req.headers;

        id = xHasuraUserId;
        role = xHasuraRole;
        company_id = xHasuraUserCompanyId;
      }

      res.json(createHasuraHeaders(role, id, company_id));
    })(req, res, next);
  };
};
