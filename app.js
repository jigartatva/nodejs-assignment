require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./services/logger');
const routes = require('./api/routes');

const app = express();
const port = process.env.PORT || 3000;
process.env.FRP = process.env.NODE_ENV === 'prod' ? '' : 'test'; // FIREBASE_REF_PREFIX

app.use(bodyParser.json());

routes(app);

app.listen(port, () => {
  logger.log(`App listening on port : ${port}`);
});

module.exports = app;
