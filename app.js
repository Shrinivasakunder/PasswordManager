const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
var _ = require("lodash");

const database = require('./config/mongodb')
const userRoute = require('./routes/routes')
require("./config/loader");

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const PORT = process.env.PORT

app.all("*", function(req, res, next) {
    var headers = _.clone(req.headers);
    var body = _.clone(req.body);
        console.log(`Request Headers: ${(headers) ? JSON.stringify(headers) : ""}`);
        console.log(`Request Body: ${ (body) ? JSON.stringify(body) : ""}`);
    
    next();
});

// app.use('/api/v1/employees', EmployeeRoute)
app.use('/api/v1/user', userRoute)
// app.use('/api/v1/sms', EmployeeRoute) 

app.listen(PORT, () => {
    console.log('Server is running on port %s', PORT)
})

