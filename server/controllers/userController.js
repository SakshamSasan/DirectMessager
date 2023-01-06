const User = require('../models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
module.exports.login = async (req,res)=>{
    try{
        let user = await User.findOne({email:req.body.email})
        if(!user||!(await user.matchPassword(req.body.password))){
            return res.json(422,{
                message:'Invalid Email/Password',
                success:false
            })
        }
        else{
            return res.json(200,{
                data: jwt.sign(user.toJSON(),`${process.env.KEY}`,{expiresIn:'10000000'}),
                message:'Signed in successfully',
                success:true
            })
        }
    }catch(err){
        console.log('**Error',err);
        return res.json(500,{
            message:err,
            success:false
        })

    }
}

module.exports.signup = async (req,res)=>{
    try{
        let user = await User.findOne({email:req.body.email})
        if(user){
            return res.json(422,{
                message:'User already exists',
                success:false
            })
        }
        else{
            let newUser = await User.create({...req.body})
            if(newUser){
                return res.json(200,{
                    data:jwt.sign(newUser.toJSON(),`${process.env.KEY}`,{expiresIn:'10000000'}),
                    success:true,
                    message:'User created successfully'
                })
            }
        }
    }catch(err){
        console.log('**Error',err);
        return res.json(500,{
            message:err,
            success:false
        })
    }
}

module.exports.fetchUsers = async (req,res)=>{
    try{

        const keyword = req.query.search ?
        {
            $or:[
                {name:{$regex:req.query.search, $options:'i'}}
            ]
        } :{};

        const users = await User.find(keyword).find({_id:{$ne:req.user._id}})
        return res.json(200,{
            data:users,
            success:true
        })
    }catch(err){
        console.log('**Error',err);
        return res.json(500,{
            message:err,
            success:false
        })
    }
}

module.exports.editUser = async (req,res)=>{
    try {
        console.log('req.body is',req.body)
        let user = await User.findOne({email:req.user.email})
        user.name = req.body.name;
        
        if(req.body.password.length>0){
            user.password = req.body.password;
        }
        if(req.body.img){
            user.avatar = req.body.img;
        }
        await user.save();
        return res.json(200,{
            data:jwt.sign(user.toJSON(),`${process.env.KEY}`,{expiresIn:'10000000'}),
            message:'Updated user successfully',
            success:true
        })

    }catch(err){
        console.log('**error in updating user',err)
        return res.json(500,{
            message:err,
            success:false
        })
    }
}