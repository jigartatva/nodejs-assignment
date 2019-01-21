const Joi = require('joi');

const articleSchema = Joi.object()
  .keys({
    nickname: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    creationDate: Joi.date().required()
  });

module.exports = articleSchema;
