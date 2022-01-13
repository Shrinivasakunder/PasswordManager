const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userName: {
        type: Number,
        unique: true
    },
    password: {
        type: String
    }
})

const websiteSchema = new Schema({
    name: {
        type: String
    },
    url: {
        type: String
    },
    userName: {
        type: String
    },
    password: {
        type: String
    },
    category: {
        type: String
    },
    admin: {
        type: Number
    }
})

const otpSchema = new Schema({
    userName: {
        type: Number,
    },
    otp: {
        type: Number
    }
})

const users = mongoose.model('User', userSchema)
const savedPassword = mongoose.model('SavedPassword', websiteSchema)
const otp = mongoose.model('OTP', otpSchema)

module.exports = { users, savedPassword, otp };