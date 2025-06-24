class ResponseBody{
    constructor(status, message, data, error) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error || null;
    }
}
const successResponse = (status, message, data) => {
    return new ResponseBody(status, message, data, null);
    
};
const errorResponse = (status, message, error) => {
    return new ResponseBody(status, message, null, error);
};

module.exports = {
    successResponse,
    errorResponse
};