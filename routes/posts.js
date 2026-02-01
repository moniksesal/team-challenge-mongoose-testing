// Todas las rutas

const express = require('express')
const router = express.Router()
const PostsController = require('../controllers/PostsController')

router.post('/create', PostsController.createPost)

router.get('/postsWithPagination', PostsController.getPostsWithPagination)
router.get('/', PostsController.getAllPosts)
router.get('/id/:_id', PostsController.getPostById)
router.get('/title/:title', PostsController.getPostByTitle)

router.put('/id/:_id', PostsController.updatePost)

router.delete('/id/:_id', PostsController.deletePost)

module.exports = router