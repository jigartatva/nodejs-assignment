const articles = require('./controllers/articles');
const comments = require('./controllers/comments');

module.exports = app => {
  app
    .route('/articles')
    .get(articles.index)
    .post(articles.create);

  app.route('/articles/:id').get(articles.show);

  app
    .route('/comments/:articleID')
    .get(comments.show)
    .post(comments.create);
};
