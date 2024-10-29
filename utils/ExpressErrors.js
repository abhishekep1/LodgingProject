class ExpressError extends Error{
    constructor(statuscCode,message){
        super();
        this.statusCode=this.statusCode;
        this.message=message;

    }
}
module.exports=ExpressError;