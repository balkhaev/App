const Boom = require('boom');
const express = require('express');
const proxy = require('http-proxy-middleware');

const graphql = require('./graphql');

const router = express.Router();

const {
  SERVICE_AUTH_HASURA_WEBHOOK_ENDPOINT,
  SERVICE_AUTH_SIGNUP_ENDPOINT,
  SERVICE_AUTH_LOGIN_ENDPOINT,
  SERVICE_GRAPHQL_ENDPOINT,
  SERVICE_UPLOAD_ENDPOINT,
  SPORTRECS_URL,
  MVSWTF_URL,
} = process.env;

router.use('/', express.static('./admin/build'));

router.post('/signup', async (req, res, next) => {
  const { data } = await req
    .axios({
      url: SERVICE_AUTH_SIGNUP_ENDPOINT,
      data: req.body,
      method: 'POST',
    })
    .catch(e => {
      next(e);
    });
  // Тут будут кастомные обработчики ошибок от сервиса c генерировацией человеку-понятных новых.

  res.json(data);
});

router.post('/login', async (req, res, next) => {
  const { data } = await req.axios
    .request({
      url: SERVICE_AUTH_LOGIN_ENDPOINT,
      data: req.body,
      method: 'POST',
    })
    .catch(e => {
      next(e);
    });

  res.json(data);
});

router.post('/graphql', async (req, res, next) => {
  const { data } = await req
    .axios({
      url: SERVICE_GRAPHQL_ENDPOINT,
      method: 'POST',
      data: req.body,
    })
    .catch(e => {
      next(e);
    });

  res.json(data);
});

router.use(
  '/upload',
  proxy({
    target: SERVICE_UPLOAD_ENDPOINT,
    secure: true,
    pathRewrite: {
      '/api/upload': '/files',
    },
    onProxyRes: proxyRes => {
      if (proxyRes.statusCode === 201 && proxyRes.headers.location) {
        let { location } = proxyRes.headers;

        location = location.replace('/files', '/api/upload');

        if (process.env.NODE_ENV !== 'development') {
          location = location.replace('http://', 'https://');
        }

        proxyRes.headers.location = location;
      }
    },
  })
);

/**
 * Hasura Webhook
 *
 * Есть идея в этом вебхуке заменить все X-Hasura-* заголовки на X-Auth-*,
 * чтобы абстрагировать сервис авторизации от Hasura.
 */
router.get('/webhook/hasura', async (req, res, next) => {
  const { data } = await req
    .axios({
      url: SERVICE_AUTH_HASURA_WEBHOOK_ENDPOINT,
      method: 'GET',
      data: req.body,
      headers: req.headers,
    })
    .catch(e => {
      const { response: { code } = {} } = e;

      if (code === 401) {
        next(Boom.unauthorized('Incorrect token'));
      }

      next(e);
    });

  res.json(data);
});

/**
 * Tusd Callback
 */
router.get('/callback/tusd', async (req, res) => {
  const { Upload, HTTPRequest } = req.body;

  // console.log({ Upload, HTTPRequest, t: 2 });

  // const data = await graphql.request(``);

  res.json({ status: true });
});

router.post('/callback/tusd', async (req, res) => {
  const { Upload, HTTPRequest } = req.body;

  // console.log({ Upload, HTTPRequest, t: 1 });

  if (!Upload) {
    res.status(500).json({ status: false });
    return;
  }

  res.status(200).send();
});

router.use(
  '/sportrecs',
  proxy({
    target: SPORTRECS_URL,
    pathRewrite: { '^/api/sportrecs/': '/' },
    changeOrigin: true,
    headers: {
      authorization:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTIxOTc4ZDNmMDkyMTQyMDFjY2U2MzciLCJpYXQiOjE1NzkyNTk4MTR9.e_7Ge2EcLo-V0kcYZK90Hl09FQkOkcqpxEvsQ7oBRTo',
    },
  })
);

router.use(
  '/mvswtf',
  proxy({
    target: MVSWTF_URL,
    pathRewrite: { '^/api/mvswtf/': '/' },
    changeOrigin: true,
  })
);

module.exports = router;
