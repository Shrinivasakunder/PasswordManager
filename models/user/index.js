const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const schema = require('./schema')
const client = require('twilio')('ACac5cedcef31cc0598231fd0debae01b0', '476937f5ecd95424732fda209afbee3c');
require('dotenv').config()



const register = (req, res, next) => {
    let password = req.body.password.toString()

    bcrypt.hash(password, 10, (err, hashedPass) => {
        if(err){
            res.json({
                error: err
            })
        }
        let user = new schema.users({
            userName: req.body.userName,
            password: hashedPass
        })
        user.save()
        .then(user => {
            res.json({
                message: 'Registration Successfull!...'
           })
        })
        .catch(error =>{
            res.json({
                Error: error.code === 11000 ? "Phone number should be unique...!!!" : error.message
            })
        })
    })
}



const login = (req, res, next) =>{
    let userName = req.body.userName
    let password = req.body.password.toString()

    schema.users.findOne({$or: [{userName:userName}]})
    .then(user =>{
        if(user){
            bcrypt.compare(password, user.password, function(err, result){
                if(err){
                    res.json({
                        error: err
                    })
                }
                if(result){
                    process.env.TOKEN = jwt.sign({},'RA72KS57HA42')
                    process.env.USER = user.userName
                    schema.savedPassword.find({admin : user.userName},{ admin:0 })
                    .then(response => {
                        res.json({
                            response
                        })
                        console.log('\nLogin Successfull!...\nToken: ',process.env.TOKEN)
                    })
                    .catch(error => {
                        res.json({
                            Error: error.message
                        })
                    })
                }else {
                    res.json({
                        
                        message: 'Password Doesn\'t match!...'
                    })
                }
            })
        }else{
            res.json({
                message: 'No User Found!...'
            })
        }
    })
}



const forgotPassword = (req, res, next) =>{
    let phone = req.body.phone
    
    schema.users.findOne({$or: [{userName : phone}]})
    .then(user =>{
        schema.otp.findOne({$or: [{userName : user.userName}]})
        .then(data =>{
            if(data != null ){
                schema.savedPassword.deleteMany({admin : data.userName})
                    .then(() => {
                        schema.users.deleteOne({userName : data.userName})
                        .then(() =>{
                            schema.otp.deleteOne({userName : data.userName})
                            .then(() =>{
                                res.json({
                                    message: 'No more resetting password option...User\'s all Data deleted...!'
                                })
                            })
                        })
                    })
            }
            else {
                var OTP = Math.floor(1000 + Math.random() * 9000);
                let otp = new schema.otp({
                    userName: user.userName,
                    otp: OTP
                })
                otp.save()
                client.messages.create({
                    body: 'Your OTP to reset password is '+ OTP,
                    to: user.userName, 
                    from: '+18457690979'
                }).then(message => {
                    res.json({
                        Status: 'OTP Sent....:)\n http://localhost:8000/api/v1/user/otp' + user.userName,
                        Message: message.body
                    })
                }).catch((error) =>console.log(error));
            }
            
        })
        
    })
    .catch(error => {
        res.json({
            Error: error.message
        })
    })
}



const otp = (req, res, next) =>{
    let otp = req.body.otp
    let userName = req.params.id
    schema.otp.findOne({$or: [{userName : userName}]})
    .then(data =>{
        if(data.otp === otp ){
            res.json({
                message: 'OTP verification successfull\n http://localhost:8000/api/v1/user/resetPassword/' + data.userName
            })
        }
        else {
            schema.otp.deleteOne({userName : data.userName})
            .then(() =>{
                res.json({
                    message: 'OTP verification failed..! Back to login page'
                })
            })
        }
    })
}



const resetPassword = (req, res, next) =>{
    let userName = req.params.id
    let newpassword = req.body.newPassword

    bcrypt.hash(newpassword, 10, (error, newHashedPass) => {
        let updatePass = {
            password: newHashedPass
        }

        schema.users.findOne({$or: [{userName:userName}]})
        .then(user =>{
            schema.users.findByIdAndUpdate(user.id, {$set: updatePass})
            .then(response => {
                res.json({
                   message: 'Password updated successfully!...'
                })
            })
            .catch(error => {
                res.json({
                    Error: error.message
                })
            })
        })
    })
}



const addWebsite = (req, res, next) => {
    let website = new schema.savedPassword({
        name: req.body.name,
        url: req.body.url,
        userName: req.body.userName,
        password: req.body.password,
        category: req.body.category,
        admin:  parseInt(process.env.USER)
    })
    website.save()
    .then(response => {
        res.json({
            message: 'Data added successfully!...'
        })
    })
    .catch(error => {
        res.json({
            Error: error.message
        })
    })
}



const getWebsite = (req, res, next) => {
    let search = req.body.search
    schema.savedPassword.find({$or: [{name: search}, {url: search}, {category: search}], admin : process.env.USER }, { admin:0 })
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            Error: error.message
        })
    })
}



const updateWebsite = (req, res, next) => {
    let dataId = req.params.id

    let updateData = {
        name: req.body.name,
        url: req.body.url,
        userName: req.body.userName,
        password: req.body.password,
        category: req.body.category
    } 
    schema.savedPassword.findByIdAndUpdate(dataId, {$set: updateData})
    .then(response => {
        res.json({
            message: 'Data updated successfully!...'
        })
    })
    .catch(error => {
        res.json({
            Error: error.message
        })
    })
}



module.exports = {
    register, login, forgotPassword, otp, resetPassword, addWebsite, getWebsite, updateWebsite
}