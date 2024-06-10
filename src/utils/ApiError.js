class APIError extends Error {
  constructor(message, statusCode, payload) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.payload = payload || {};
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        statusCode: this.statusCode,
        payload: this.payload,
      },
    };
  }
}

export default APIError;
