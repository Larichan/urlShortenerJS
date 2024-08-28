const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const referenceTable = require('./base62ReferenceTable')
require('dotenv').config()

module.exports = async(app, database) => {
    app.use(express.json({ limit: '1mb' }))
    app.use(express.urlencoded({ extended: true, limit: '1mb' }))
    app.use(cors({ origin: '*' }))
    app.use(express.static(__dirname + '/public'))

    app.get(`/${process.env.APP_NAME}/:hashValue`, (request, response) => {
        const shortUrl = `${process.env.BASE_URL}/${process.env.APP_NAME}/${request.params.hashValue}`
        database(`SELECT * FROM "urlStorage" WHERE "shortUrl"=$1`, [shortUrl], (error, res) => {
            if(error) console.log(error)
            else if(res.rows.length > 0){
                const longUrl = res.rows[0].longUrl
                response.redirect(longUrl)
            } else {
                response.status(204).json({
                    "message": "Shortify your URL!",
                })
            }
        })
    })

    app.post('/shortfy', (request, response) => {
        const longUrl = request.body.url
        database(`SELECT * FROM "urlStorage" WHERE "longUrl"=$1`, [longUrl], (error, res) => {
            if(error) console.log(error)
            else {
                if(res.rows.length === 0) {
                    const uuid = uuidv4()
                    var numericId = 1
                    for(let index = 0; index < uuid.length; index++) {
                        let char = uuid[index]
                        let value = char.charCodeAt(0)
                        if(value >= 48 && value <= 57) {
                            numericId += value - 48
                        } else if(value >= 65 && value <= 90) {
                            numericId += value - 65 + 11
                        } else if(value >= 97 && value <= 122) {
                            numericId += value - 97 + 73
                        }
                    }

                    const salt = Math.ceil(Math.random() * 100) * 23 * 7
                    numericId *= salt
                    var generatedHashValue = ""
                    let dummyId = numericId

                    while(dummyId > 0) {
                        const rem = dummyId % 62
                        generatedHashValue += referenceTable[rem]
                        dummyId = Math.floor(dummyId/62)
                    }
                    const hashValue = generatedHashValue

                    var shortUrl = `${process.env.BASE_URL}/${process.env.APP_NAME}/${hashValue}`

                    database(`INSERT INTO "urlStorage" ("longUrl", "shortUrl") VALUES ($1, $2)`, [longUrl, shortUrl], (error, res) => {
                        if(error) console.log(error)
                        else console.log(res)
                    })

                    response.status(200).json({
                        "message": "Inserted a new URL",
                        "shortUrl": shortUrl,
                        "longUrl": longUrl
                    })
                    
                } else {
                    response.status(200).json({
                        "message": "URL in database already",
                        "shortUrl": res.rows[0].shortUrl,
                        "longUrl": longUrl
                    })
                }
            }
        })
    })
}