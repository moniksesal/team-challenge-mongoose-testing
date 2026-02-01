const Post = require('../models/Post')

const PostsController = {
    createPost: async (req, res) => {
        try {
            const post = await Post.create(req.body)
            res.json(post)
            //No hace falta que hagamos los if(!req.body.title)... porque ya hemos hecho el required en Post.js
        } catch (error) {
            console.error(error)
            res.status(500).json('Error en el servidor')
        }
    },
    getPostsWithPagination: async (req, res) => {
        try { //*****
            //página desde query, por defecto 1
            const page = parseInt(req.query.page) || 1
            const limit = 10
            const skip = (page - 1) * limit

            //buscar posts con skip y limit
            const posts = await Post.find().skip(skip).limit(limit)

            res.json(posts)
        } catch (error) {
            console.error(error)
            res.status(500).json('Error en el servidor')
        }
    },
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find()
            res.json(posts)
        } catch (error) {
            console.error(error)
            res.status(500).json('Error en el servidor')
        }
    },
    getPostById: async (req, res) => {
        try {
            const _id = req.params._id
            if (!_id || _id == "") {
                return res.status(400).json('id is required')
            }
            const post = await Post.findById(_id)
            if (!post) {
                res.status(404).json('post not found')
            }
            res.json(post)
        } catch (error) {
            console.error(error)
            res.status(500).json('Error en el servidor')
        }
    },
    getPostByTitle: async (req, res) => {
        try {
            const title = req.params.title
            if (!title || title == "") {
                return res.status(400).json('title is required')
            }
            const post = await Post.find({title: title})
            if (post.length === 0) { //porque Post.find es un array, entonces no podemos poner (!post) sino que hay que ver si el array está vacío
                return res.status(404).json('post not found')
            }
            res.json(post)
        } catch (error) {
            console.error(error)
            res.status(500).json('Error en el servidor')
        }
    },
    updatePost: async (req, res) => {
        try {
            const _id = req.params._id
            if (!_id || _id == "") {
                return res.status(400).json('id is required')
            }
            const post = await Post.findByIdAndUpdate( //de qué id queremos actualizar y qué queremos actualizar
                _id,
                req.body,
                {new: true, runValidators: true} //devuelve el post actualizado y valida según el schema
            )
            if (!post) {
                return res.status(404).json('post not found')
            }
            res.json(post)
        } catch (error) {
            console.error(error)
            res.status(500).json('Error en el servidor')
        }
    },
    deletePost: async (req, res) => {
        try {
            const _id = req.params._id
            if (!_id || _id == "") {
                return res.status(400).json('id is required')
            }
            const post = await Post.findByIdAndDelete(_id)
            if (!post) {
                return res.status(404).json('post not found')
            }
            res.json(post)
        } catch (error) {
            console.error(error)
            res.status(500).json('Error en el servidor') 
        }
    }
}

module.exports = PostsController

/* *****
req.query.page es lo que viene en la URL como query. Ejemplo: Si haces 
/postsWithPagination?page=2, entonces req.query.page es "2" 
(ojo: siempre es string, no número).

parseInt convierte string a número entero. Ejemplo: parseInt("2") → 2.
Si la query no viene (undefined) entonces parseInt(undefined) da NaN

|| 1 --> si no viene page o no es un número válido, ponemos 1 por defecto.

limit = 10, cuántos posts queremos mostrar por página?? 10

const skip = (page - 1) * limit --> skip es: cuántos posts saltamos antes de tomar 
los siguientes limit. Sería (página - 1) * postsPorPagina. Ejemplos:

Página 1 → (1-1)*10 = 0 → no saltamos nada
Página 2 → (2-1)*10 = 10 → saltamos los primeros 10
Página 3 → (3-1)*10 = 20 → saltamos los primeros 20
Esto sirve para que cada página traia los posts corectos

.skip(skip) salta los primeros X documentos según la página.
.limit(limit) toma solo 10 documentos para no traerlos todos

skip(n) → le dice a MongoDB: “salta los primeros n documentos y empieza a devolver 
desde ahí”.
limit(n) → le dice: “devuélveme como máximo n documentos”.*/

