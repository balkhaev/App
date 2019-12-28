const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

const devProxy = {
  '/api': {
    target: process.env.BACKEND_ENDPOINT,
    pathRewrite: { '^/api': '/' },
    changeOrigin: true,
  },
};

app.prepare().then(() => {
  const server = express();

  if (dev && devProxy) {
    const proxyMiddleware = require('http-proxy-middleware');

    Object.keys(devProxy).forEach(function(context) {
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
