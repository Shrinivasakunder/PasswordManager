const userModel = require('../models/user/index')

const register = (req, res, next) => {
    userModel.register(req, res, next)
}

const login = (req, res, next) => {
    userModel.login(req, res, next)
}

const forgotPassword = (req, res, next) => {
    userModel.forgotPassword(req, res, next)
}

const otp = (req, res, next) => {
    userModel.otp(req, res, next)
}

const resetPassword = (req, res, next) => {
    userModel.resetPassword(req, res, next)
}

const addWebsite = (req, res, next) => {
    userModel.addWebsite(req, res, next)
}

const getWebsite = (req, res, next) => {
    userModel.getWebsite(req, res, next)
}

const updateWebsite = (req, res, next) => {
    userModel.updateWebsite(req, res, next)
}


module.exports = {
    register, login, forgotPassword, otp, resetPassword, addWebsite, getWebsite, updateWebsite
}