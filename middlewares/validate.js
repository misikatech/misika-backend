const ApiResponse = require('../utils/ApiResponse');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details[0].message;
      return ApiResponse.error(res, errorMessage, 400);
    }
    
    next();
  };
};

module.exports = { validate };