const {ValidationError}=require('./errors')


const validate =(schema,data)=>{
    const result=schema.validate(data);
    if(result.error){
        throw new ValidationError(result.error.details[0].message)
    }
    return true
}

module.exports=validate