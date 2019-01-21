require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./services/logger');
const routes = require('./api/routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

routes(app);

app.listen(port, () => {
  logger.log(`App listening on port : ${port}`);
});
