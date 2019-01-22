const Joi = require('joi');

const commentSchema = Joi.object()
  .keys({
    nickname: Joi.string().required(),
    content: Joi.string().required(),
    creationDate: Joi.date().required()
  });

module.exports = commentSchema;
