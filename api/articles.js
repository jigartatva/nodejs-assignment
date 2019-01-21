const { firebaseDB } = require('../services/firebase');
const logger = require('../services/logger');
const common = require('../services/common');

const articles = {
  index: (req, res) => {
    logger.log('>> articles.index');

    const articlesRef = firebaseDB.ref('/articles');

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
