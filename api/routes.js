const articles = require('./controllers/articles');

module.exports = app => {
  app
    .route('/articles')
    .get(articles.index)
    .post(articles.create);
};
