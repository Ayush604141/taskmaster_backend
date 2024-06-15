class APIError extends Error {
  constructor(message, statusCode = 500, payload = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = this.validateStatusCode(statusCode);
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }

  validateStatusCode(statusCode) {
    if (
      typeof statusCode !== "number" ||
      statusCode < 400 ||
      statusCode > 599
    ) {
      throw new Error("Invalid HTTP status code");
    }
    return statusCode;
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
