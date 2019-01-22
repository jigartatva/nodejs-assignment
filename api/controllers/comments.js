const { firebaseDB } = require('../../services/firebase');
const logger = require('../../services/logger');
const common = require('../../services/common');
const commentSchema = require('../joi/commentSchema');

const comments = {
  // GET /comments/:articleID
  show: (req, res) => {
    logger.log('>> comments.show');

    const { articleID } = req.params;
    const commentRef = firebaseDB.ref(`${process.env.FRP}/comments/${articleID}`);

    commentRef.on(
      'value',
      snapshot => {
        const snap = snapshot.val();

        if (snap) {
          res.json(common.response(200, 'Comments found successfully.', snap));
        } else {
          res.json(common.response(204, 'No comments found!'));
        }

        commentRef.off('value');
      },
      errorObject => {
        logger.error(`The read failed: ${errorObject.code}`);
        res.json(common.response(errorObject.code));
      }
    );
  },

  // POST /comments/:articleID/:commentID?
  create: async (req, res) => {
    logger.log('>> comments.create');
    logger.log('>> req.body : ', req.body);

    const data = {
      nickname: req.body.nickname,
      content: req.body.content,
      creationDate: req.body.creationDate
    };

    const validationResult = common.validateReq(data, commentSchema);
    if (validationResult.isInvalid > 0) {
      res.json(validationResult.invalidResponse);
    } else {
      const { articleID, commentID: parentCommentID } = req.params;

      // Check if the comment is on article or comment
      const parentRef = parentCommentID
        ? await getParentRef(parentCommentID)
        : `comments/${articleID}`;

      logger.log('>> parentRef : ', parentRef);
      if (parentRef) {
        // Get a key for the new comment.
        const newCommentID = firebaseDB
          .ref()
          .child(parentRef)
          .push().key;

        // Set parentPath based on whether the comment is on article or comment
        const parentPath = (parentCommentID) ? `${parentRef}/${parentCommentID}` : `${process.env.FRP}/${parentRef}`;
        data.parentRef = parentPath.replace(/^\/|\/$/g, '');
        logger.log('>> data.parentRef : ', data.parentRef);

        firebaseDB.ref(`${parentPath}/${newCommentID}`).set(data, error => {
          if (error) {
            res.json(common.response(500, `Comment could not be saved. | ${error}`));
          } else {
            setParentRef(newCommentID, data.parentRef);
            res.json(common.response(201, 'Comment saved successfully.', { id: newCommentID }));
          }
        });
      } else {
        res.json(common.errorResponse(['Parent comment does not exist']));
      }
    }
  }
};

/**
 * To get parentRef of the comment
 *
 * @param   {String}  commentID
 *
 * @return  {String}
 */
async function getParentRef(commentID) {
  const commentRef = firebaseDB.ref(`${process.env.FRP}/comment-refs/${commentID}`);

  const promise = new Promise((resolve, reject) => {
    commentRef.on(
      'value',
      snapshot => {
        const snap = snapshot.val();
        commentRef.off('value');
        resolve(snap);
      },
      errorObject => {
        logger.error(`The read failed: ${errorObject.code}`);
        reject(new Error(errorObject.code));
      }
    );
  });

  try {
    return await promise;
  } catch (error) {
    return false;
  }
}

/**
 * To set parentRef of the comment
 *
 * @param   {String}  commentID
 * @param   {String}  ref
 *
 * @return  {String}
 */
function setParentRef(commentID, ref) {
  firebaseDB.ref(`${process.env.FRP}/comment-refs/${commentID}`).set(ref, error => {
    if (error) {
      logger.error('>> setParentRef failed : ', error);
    }
  });
}

module.exports = comments;
