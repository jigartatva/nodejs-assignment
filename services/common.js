const response = (code = 200, message = '', data = []) => {
  message = message || 'Something went wrong! Please retry later.';

  return {
    code: code,
    message: message,
    data: data
  };
};

module.exports = { response };
