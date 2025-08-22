const validator =require("validator");

// req.body 

const validate = (data)=>{
   
    const mandatoryField = ['firstName', "emailId",'password'];

    const IsAllowed = mandatoryField.every((k)=> Object.keys(data).includes(k));

    if(!IsAllowed)
        throw new Error("Some Field Missing");

    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid Email");

    // Relaxed password validation - at least 6 characters
    if(!data.password || data.password.length < 6)
        throw new Error("Password must be at least 6 characters long");
}

module.exports = validate;