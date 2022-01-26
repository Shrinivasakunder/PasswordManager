const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userId: {
        type: Number,
        unique: true
    },
    password: {
        type: String
    },
    resetCount: {
        type: Number
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
    userId: {
        type: Number
    }
})

const otpSchema = new Schema({
    userId: {
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