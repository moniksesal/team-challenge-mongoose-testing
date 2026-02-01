const express = require('express')
const postsRouter = require('./posts')
const router = express.Router()

router.use('/', postsRouter)

module.exports = router