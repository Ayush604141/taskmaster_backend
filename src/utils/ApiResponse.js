class APIResponse {
  constructor(data, statusCode = 200) {
    this.statusCode = statusCode;
    this.data = data;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      data: this.data,
    };
  }
}

export default APIResponse;
