class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res, message = 'Error', statusCode = 500, stack = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    if (stack && process.env.NODE_ENV === 'development') {
      response.stack = stack;
    }

    return res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
