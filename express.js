const express = require('express');
const serveStatic = require('serve-static');
const app = express();

const port = 3000;

app.use(serveStatic('public', { index: ["index.html"]}));

app.listen(port);