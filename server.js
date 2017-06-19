const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/examples/:id', (req, res) => {
      const actualPage = '/';
      const queryParams = { exampleId: req.params.id };

      app.render(req, res, actualPage, queryParams);
    });

    server.get('/feedback/*', (req, res) => {
      const actualPage = '/feedback';
      const queryParams = {};

      app.render(req, res, actualPage, queryParams);
    });

    server.get('/v/:snippetId', (req, res) => {
      const actualPage = '/';
      const queryParams = { snippetId: req.params.snippetId };

      app.render(req, res, actualPage, queryParams);
    });

    server.get('/', (req, res) => {
      const actualPage = '/';
      const queryParams = { exampleId: 'basic-interval' };

      app.render(req, res, actualPage, queryParams);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000'); // eslint-disable-line no-console
    });
  })
  .catch(ex => {
    console.error(ex.stack); // eslint-disable-line no-console
    process.exit(1);
  });
