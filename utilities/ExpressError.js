const { modelName } = require("../models/campground");

class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;

    }
}
module.exports = ExpressError;