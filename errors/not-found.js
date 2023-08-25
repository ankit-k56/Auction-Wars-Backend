const CusomApiError = require('./custom-api-error')

class NotFoundError extends CusomApiError{
    constructor(message){
        super(message);
        this.statusCode = 404;
        this.status= 'fail'
    }
}

module.exports= NotFoundError