const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const schema = require('./schema');
var fs = require('fs');
const client = require('twilio')('ACac5cedcef31cc0598231fd0debae01b0', 'd7cef5e879f6bf9a6c9660930957f569');
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
            userId: req.body.userId,
            password: hashedPass,
            resetCount: 0
        })
        user.save()
        .then(user => {
            res.json({
                message: 'Registration Successfull!...'
           })
        })
        .catch(error =>{
            res.json({
                Error: error.code === 11000 ? "User Id should be unique...!!!" : error.message
            })
        })
    })
}



const login = (req, res, next) =>{
    let userId = req.body.userId
    let password = req.body.password.toString()

    schema.users.findOne({$or: [{userId:userId}]})
    .then(user =>{
        if(user){
            bcrypt.compare(password, user.password, function(err, result){
                if(err){
                    res.json({
                        error: err
                    })
                }
                if(result){
                    process.env.TOKEN = jwt.sign({},userId.toString())
                    schema.savedPassword.find({userId : user.userId},{ userId:0 })
                    .then(response => {
                        res.json({
                            status: "Login Successsfull :)",
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
    
    schema.users.findOne({$or: [{userId : phone}]})
    .then(user =>{
        if( user.resetCount === 1 ){
            schema.savedPassword.deleteMany({userId : user.userId})
            .then(() => {
                schema.users.deleteOne({userId : user.userId})
                .then(() =>{
                    res.json({
                        message: 'Resetting password limit crossed ...User\'s all Data deleted...!'
                    })
                })
            })
        }
        else {
            var OTP = Math.floor(1000 + Math.random() * 9000);
            let otp = new schema.otp({
                userId: user.userId,
                otp: OTP
            })
            otp.save()
            client.messages.create({
                body: 'Your OTP to reset password is '+ OTP,
                to: '+91'+ user.userId, 
                from: '+18457690979'
            }).then(message => {
                res.json({
                    Status: 'OTP Sent....:)\n        http://localhost:8000/api/v1/user/otp',
                })
            }).catch((error) =>console.log(error));
        }   
    })
    .catch(error => {
        res.json({
            Error: error.message
        })
    })
}



const otp = (req, res, next) =>{
    let otp = req.body.otp
    let userId = req.body.userId
    schema.otp.findOne({$or: [{userId : userId}]})
    .then(data =>{
        if(data.otp === otp ){
            schema.otp.deleteOne({userId : data.userId})
            .then(() =>{
                res.json({
                    message: 'OTP verification successfull\n          http://localhost:8000/api/v1/user/resetPassword'
                })
            })
            
        }
        else {
            schema.otp.deleteOne({userId : data.userId})
            .then(() =>{
                res.json({
                    message: 'OTP verification failed..! Back to login page'
                })
            })
        }
    })
}



const resetPassword = (req, res, next) =>{
    let userId = req.body.userId
    let newpassword = req.body.newPassword.toString()

    bcrypt.hash(newpassword, 10, (error, newHashedPass) => {
        let updatePass = {
            password: newHashedPass,
            resetCount: 1
        }

        schema.users.findOne({$or: [{userId:userId}]})
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
    let password = req.body.password.toString()

    bcrypt.hash(password, 10, (err, hashedPass) => {
        if(err){
            res.json({
                error: err
            })
        }
        let website = new schema.savedPassword({
            name: req.body.name,
            url: req.body.url,
            userName: req.body.userName,
            password: hashedPass,
            category: req.body.category,
            userId:  req.body.userId
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
    })
}



const getWebsite = (req, res, next) => {
    let userId = req.body.userId
    schema.savedPassword.find({userId : userId},{ userId:0 })
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
    let dataId = req.body.id 
    let userId = req.body.userId
    var password = req.body.password
    if(password !== undefined){
        password = password.toString()
        bcrypt.hash(password, 10, (err, hashedPass) => {
            if(err){
                res.json({
                    error: err
                })
            }
            let updateData = {
                name: req.body.name,
                url: req.body.url,
                userName: req.body.userName,
                password: hashedPass,
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
        })
    }
    else{
        let updateData = {
            name: req.body.name,
            url: req.body.url,
            userName: req.body.userName,
            password: password,
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
}



const getSearch = (req, res, next) => {
    let userId = req.body.userId
    let search = req.body.search
    schema.savedPassword.find({$or: [{name: search}, {url: search}, {category: search}], userId : userId }, { userId:0 })
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



const copyPassword = (req, res, next) => {
    let userId = req.body.userId
    let id = req.body.id
    schema.savedPassword.findById(id)
    .then(response => {
        res.json({
            response: response.password
        })
    })
    .catch(error => {
        res.json({
            Error: error.message
        })
    })
}



const syncData = (req, res, next) => {
    let userId = req.body.userId
    var file = 'Sync/'+ userId + '.json'
    schema.savedPassword.find({userId : userId})
    .then(response => {
        fs.writeFile(file, JSON.stringify(response), function (err) {  
            if (err) throw err;
            res.json({
                status: "Data synced to cloud"
            })
        })
    })
}




module.exports = {
    register, login, forgotPassword, otp, resetPassword, addWebsite, getWebsite, updateWebsite, getSearch, copyPassword, syncData
}