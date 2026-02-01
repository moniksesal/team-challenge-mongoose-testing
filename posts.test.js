// posts.test.js
const mongoose = require('mongoose')
const PostsController = require('./controllers/PostsController')
const Post = require('./models/Post')

// aumentamos timeout de Jest por si la DB es lenta
jest.setTimeout(10000)

// conectamos a la base de datos antes de todos los tests
beforeAll(async () => {
  const dbConnection = require('./config/config')
  await dbConnection()
})

// limpiamos la colección antes de cada test
beforeEach(async () => {
  await Post.deleteMany({})
})

// cerramos la conexión al final
afterAll(async () => {
  await mongoose.connection.close()
})

describe('CREATE POST', () => {
  it('should create a post', async () => {
    // simulamos req y res de Express
    const req = {
      body: {
        title: "Mariluz",
        body: "testing"
      }
    }

    let createdPost = null
    const res = {
      json: (post) => { createdPost = post }
    }

    // llamamos al controller
    await PostsController.createPost(req, res)

    // verificamos que se creó correctamente
    if (!createdPost || createdPost.title !== "Mariluz") {
      throw new Error('Post no se creó correctamente')
    }
  })
})

describe('GET POSTS', () => {
  it('should get all posts', async () => {
    // primero creamos un post directamente en la DB para probar el GET
    await Post.create({ title: "Mariluz", body: "testing" })

    const req = {}  // GET no necesita body ni params
    let posts = null
    const res = {
      json: (data) => { posts = data }
    }

    // llamamos al controller
    await PostsController.getAllPosts(req, res)

    // verificamos que recibimos al menos 1 post
    if (!posts || posts.length === 0) {
      throw new Error('No se encontraron posts')
    }

    // verificamos que el título coincide
    if (posts[0].title !== "Mariluz") {
      throw new Error('El post recibido no coincide')
    }
  })
})
