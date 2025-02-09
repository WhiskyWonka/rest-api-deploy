const express = require('express');

const app = express();
app.disable('x-powered-by'); // esto es por seguridad para que no sepan que estamos usando express

const dittoJSON = require('./pokemon/ditto.json');

const PORT = process.env.PORT || 3000;

// ejemplo de middleware para todas las rutas y todos los metodos
// app.use((req, res, next) => {
//   if (req.method !== 'POST') return next();
//   if (req.headers['content-type'] !== 'application/json') return next();

//   let body = '';

//   req.on('data', (chunk) => {
//     body += chunk.toString();
//   });

//   req.on('end', () => {
//     const data = JSON.parse(body);

//     req.body = data;
//     next();
//   });

// });

// lo mismo que hace el ejemlo de arriba ya lo hace solo express
app.use(express.json());

app.get('/pokemon/ditto', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(dittoJSON));
});

app.post('/pokemon', (req, res) => {
  const { url } = req;

  switch (url) {
    case '/pokemon':
      res.status(201).json(req.body);
      break;
    default:
      res.setStatusCode = 404;
      return res.end('Not Found');
  }

});

app.use((req, res) => {
  res.status(404).end('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});