const CustomApiError = require('./custom-api-error')

class UnAuthenticated extends CustomApiError{
    constructor(message){
        super(message);
        this.statusCode = 401;
        this.status= 'fail'
    }
}
module.exports = UnAuthenticated