const express = require('express')
const routes = require('./routes')
const dbConnection = require('./config/config')
const app = express()
const PORT = 3000

app.use(express.json())

dbConnection()

app.use('/post', routes)

app.listen(PORT, () => {
    console.log(`El puerto está escuchando en http://localhost:${PORT}`)
})