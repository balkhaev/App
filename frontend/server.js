const proxyMiddleware = require('http-proxy-middleware');
const express = require('express');
const next = require('next');

const DEV = process.env.NODE_ENV === 'development';
const PORT = process.env.PORT || 3000;

const app = next({ dev: DEV });
const handle = app.getRequestHandler();

const devProxy = {
  '/api': {
    target: process.env.BACKEND_ENDPOINT,
    pathRewrite: { '^/api': '/' },
    changeOrigin: true,
  },
};

app.prepare().then(() => {
  const server = express();

  if (DEV && devProxy) {
    Object.keys(devProxy).forEach(context => {
      server.use(proxyMiddleware(context, devProxy[context]));
    });
  }

  server.all('*', (req, res) => handle(req, res));

  server.listen(PORT, err => {
    if (err) {
      throw err;
    }

    console.log(`> Ready on http://localhost:${PORT} [${process.env.NODE_ENV}]`);
  });
});
