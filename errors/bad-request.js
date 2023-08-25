const CustomApiError = require('./custom-api-error')

class Badrequest extends CustomApiError{
    constructor(message){
        super(message);
        this.statusCode = 400;
        this.status= 'fail'
    }
}
module.exports = Badrequest