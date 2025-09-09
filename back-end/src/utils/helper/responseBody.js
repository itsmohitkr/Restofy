class ResponseBody {
  constructor(success, message, data, error) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error || null;
  }
}
const successResponse = (message, data) => {
  return new ResponseBody(true, message, data, null);
};
const errorResponse = (message, error) => {
  return new ResponseBody(false, message, null, error);
};

module.exports = {
  successResponse,
  errorResponse,
};
