const express = require('express')
const expressApp = require('./express-app')
const database = require('./database')
require('dotenv').config()

const startServer = async() => {
    const app = express();

    await expressApp(app, database)

    app.listen(process.env.PORT, () => {
        console.log(`Listening to port ${process.env.PORT}`)
    }).on('error', (err) => {
        console.log(err)
        process.exit()
    })
}

startServer()