const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({path:'../config.env'});
const generateToken = async(user,res)=>{
    const token = await jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'2h'});
    res.status(201).json({
        status:"success",
        token,
        user_id:user._id,
        expiresIn:3600
    });
}

exports.signUp = async(req,res,next) => {
       try{
            const user = await User.create({
            email:req.body.email,
            password:req.body.password
        });
        generateToken(user,res);
        }
        catch(err){
        res.status(400).json({
            message:'Invalid email and password'
        })}
    
    
}


exports.login = async (req,res,next)=>{
      try{  
          const {email,password} = req.body;
          const user = await User.findOne({email:email}).select('password');
          if(!user || !(await user.comparePassword(password,user.password))) res.status(401).json({message:'Invalid email and password!'});
          generateToken(user,res);
         }
     catch(err){
        res.status(401).json({
            message:'Invalid email and password'
        })
        }
}


exports.protect = async(req,res,next)=>{
       try{
        let token = req.headers.authorization.split(' ')[1];
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.id;
        next();
       }
       catch(err){
        res.status(401).json({status:'fail',message:' Not authorize user!'})
       }


}