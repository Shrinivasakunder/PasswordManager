const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
    try{
        const decode = jwt.verify(process.env.TOKEN, 'RA72KS57HA42')
        req.user = decode
        next()
    }
    catch(error){
        res.json({
            message: 'User Authentication Failed!...'
        })
    }
}

module.exports = { authenticate }