const joi = require("@hapi/joi")

const addUser = joi.object({
    userId: joi.number().integer().min(1000000000).message("Invalid Mobile Number").max(9999999999).message("Invalid Mobile Number").required(),
    password: joi.number().integer().min(1000).message("Password should be 4 digit pin").max(9999).message("Password should be 4 digit pin").required(),
    confirmPassword:joi.any().required().equal(joi.ref('password')).options({ messages: { 'any.only': 'Password and Confirm Password must match' } })
})  

const updateUser = joi.object({
    userId: joi.number().integer().min(1000000000).message("Invalid Mobile Number").max(9999999999).message("Invalid Mobile Number").required(),
    newPassword: joi.number().integer().min(1000).message("Password should be 4 digit pin").max(9999).message("Password should be 4 digit pin").required(),
    confirmPassword:joi.any().required().equal(joi.ref('newPassword')).options({ messages: { 'any.only': 'Password and Confirm Password must match' } })
}) 

const addWebsite = joi.object({
    name: joi.string().max(12).required(),
    url: joi.string().required(),
    userName: joi.string().required(),
    password: joi.string().required(),
    category: joi.string().required(),
    userId: joi.number().integer()
}) 

const updateWebsite = joi.object({
    id: joi.string(),
    name: joi.string().max(12),
    url: joi.string(),
    userName: joi.string(),
    password: joi.string(),
    category: joi.string(),
    userId: joi.number().integer()
}) 

module.exports = {
    addUser: async (req, res, next) =>{
        const value = await addUser.validate(req.body);
        if(value.error){
            res.json({
                message: value.error.details[0].message
            })
        } else{
            next()
        }
    },

    updateUser: async (req, res, next) =>{
        const value = await updateUser.validate(req.body);
        if(value.error){
            res.json({
                message: value.error.details[0].message
            })
        } else{
            next()
        }
    },

    addWebsite: async (req, res, next) =>{
        const value = await addWebsite.validate(req.body);
        if(value.error){
            res.json({
                message: value.error.details[0].message
            })
        } else{
            next()
        }
    },

    updateWebsite : async (req, res, next) =>{
        const value = await updateWebsite.validate(req.body);
        if(value.error){
            res.json({
                message: value.error.details[0].message
            })
        } else{
            next()
        }
    }
}