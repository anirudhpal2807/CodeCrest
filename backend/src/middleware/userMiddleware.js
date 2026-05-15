const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis")

const userMiddleware = async (req,res,next)=>{

    try{
        
        const {token} = req.cookies;
        if(!token)
            throw new Error("Token is not persent");

        const payload = jwt.verify(token,process.env.JWT_KEY);

        const {_id} = payload;

        if(!_id){
            throw new Error("Invalid token");
        }

        const result = await User.findById(_id);

        if(!result){
            throw new Error("User Doesn't Exist");
        }

        // Redis ke blockList mein persent toh nahi hai

        const IsBlocked = await redisClient.exists(`token:${token}`);

        if(IsBlocked)
            throw new Error("Invalid Token");

        req.result = result;


        next();
    }
    catch(err){
        res.status(401).send("Error: "+ err.message)
    }

}

/** Loads req.result when a valid JWT is present; otherwise continues with req.result undefined. */
const optionalUserMiddleware = async (req, res, next) => {
    delete req.result;
    try {
        const { token } = req.cookies;
        if (!token) return next();
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;
        if (!_id) return next();
        const result = await User.findById(_id);
        if (!result) return next();
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) return next();
        req.result = result;
        next();
    } catch {
        next();
    }
};

userMiddleware.optionalUser = optionalUserMiddleware;

module.exports = userMiddleware;
