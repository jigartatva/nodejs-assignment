const articles = require('./articles');

module.exports = app => {
  app.route('/articles').get(articles.index);
};
