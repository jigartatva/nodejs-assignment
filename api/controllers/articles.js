const { firebaseDB } = require('../../services/firebase');
const logger = require('../../services/logger');
const common = require('../../services/common');
const articleSchema = require('../joi/articleSchema');

const articles = {
  index: (req, res) => {
    logger.log('>> articles.index');

    const articlesRef = firebaseDB.ref(`${process.env.FRP}/articles`);

    articlesRef.on(
      'value',
      snapshot => {
        const snap = snapshot.val();
        if (snap) {
          res.json(common.response(200, 'Articles found successfully.', formatData(snap)));
        } else {
          res.json(common.response(204, 'No articles found!'));
        }

        articlesRef.off('value');
      },
      errorObject => {
        logger.error(`The read failed: ${errorObject.code}`);
        res.json(common.response(errorObject.code));
      }
    );
  },
  show: (req, res) => {
    logger.log('>> articles.show');

    const articleID = req.params.id;
    const articleRef = firebaseDB.ref(`${process.env.FRP}/articles/${articleID}`);

    articleRef.on(
      'value',
      snapshot => {
        const snap = snapshot.val();

        if (snap) {
          res.json(common.response(200, 'Article found successfully.', { id: articleID, ...snap }));
        } else {
          res.json(common.response(204, 'No articles found!'));
        }

        articleRef.off('value');
      },
      errorObject => {
        logger.error(`The read failed: ${errorObject.code}`);
        res.json(common.response(errorObject.code));
      }
    );
  },
  create: (req, res) => {
    logger.log('>> articles.create');
    logger.log('>> req.body : ', req.body);

    const data = {
      nickname: req.body.nickname,
      title: req.body.title,
      content: req.body.content,
      creationDate: req.body.creationDate
    };

    const validationResult = common.validateReq(data, articleSchema);
    if (validationResult.isInvalid > 0) {
      res.json(validationResult.invalidResponse);
    } else {
      // Get a key for the new article.
      const articleID = firebaseDB
        .ref()
        .child('articles')
        .push().key;

      firebaseDB.ref(`${process.env.FRP}/articles/${articleID}/`).set(data, error => {
        if (error) {
          res.json(common.response(500, `Article could not be saved. | ${error}`));
        } else {
          res.json(common.response(201, 'Article saved successfully!', { id: articleID }));
        }
      });
    }
  }
};

/**
 * To format data into specific structure
 *
 * @param   {Object}  snap
 *
 * @return  {Array}
 */
function formatData(snap) {
  const data = [];

  Object.keys(snap).forEach(key => {
    const temp = {
      id: key,
      ...snap[key]
    };

    data.push(temp);
  });

  return data;
}

module.exports = articles;
