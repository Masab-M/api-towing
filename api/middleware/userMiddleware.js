const { DataTypes } = require("sequelize");
const { sequelize } = require("../../models");
const { User } = require("../../models/Role")(sequelize, DataTypes);
const { validationResult } = require('express-validator');
const crypto = require('crypto')

const fetchUser = async(req, res, next) => {
    const bodyErr=validationResult(req)
    //body error 
    if(!bodyErr.isEmpty()) return res.status(400).json({errors: bodyErr.array()})
    // find user
    let authUser=req.body
    console.log(authUser);
    authUser.password = crypto.createHash('md5').update(authUser.password).digest("hex")
    const user = await User.findOne({ where: { email:authUser.email,password:authUser.password } });
    console.log(authUser.email);
    if (user === null) {
        res.status(400).json({message:'User not Found'})
    } else {
        req.user=user
        next()
    }
}
module.exports={
    //find user
    fetchUser
}