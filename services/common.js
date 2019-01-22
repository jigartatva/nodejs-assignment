// Common functionalities throughout app

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
    invalidResponse = errorResponse(errors);
  }

  return { isInvalid, invalidResponse };
});

// For standard successful response throughout the API endpoints
const response = (code = 200, message = '', data = []) => {
  message = message || 'Something went wrong! Please retry later.';

  return {
    code: code,
    message: message,
    data: data
  };
};

// For standard error response throughout the API endpoints
const errorResponse = (errors = [], code = 422, message = '', data = []) => {
  message = message || 'Invalid request data. Please review request and try again.';

  return {
    code: code,
    message: message,
    data: data,
    errors: errors
  };
};

module.exports = { validateReq, response, errorResponse };
