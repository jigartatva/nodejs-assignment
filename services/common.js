const _ = require('lodash');
const Joi = require('joi');

// Joi validation options
const validationOptions = {
  abortEarly: false, // abort after the last validation error
  allowUnknown: true, // allow unknown keys that will be ignored
  stripUnknown: true // remove unknown keys from the validated data
};

// Validate using the schema and validation options
const validateReq = (obj, schema) => Joi.validate(obj, schema, validationOptions, err => {
  let isInvalid = false;
  let invalidResponse;

  if (err) {
    isInvalid = true;
    const errors = _.map(err.details, ({ message }) => message.replace(/['"]/g, ''));
    invalidResponse = response(
      422,
      'Invalid request data. Please review request and try again.',
      errors
    );
  }

  return { isInvalid, invalidResponse };
});

const response = (code = 200, message = '', data = []) => {
  message = message || 'Something went wrong! Please retry later.';

  return {
    code: code,
    message: message,
    data: data
  };
};

module.exports = { validateReq, response };
