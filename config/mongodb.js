const mongoose = require('mongoose')
const database = require("./config")

mongoose.connect(database.mongodb, {useNewUrlparser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('error', (err) =>{
    console.log(err)
})

db.once('open', () => {
    console.log('Database connection Established...')
})

module.exports = mongoose