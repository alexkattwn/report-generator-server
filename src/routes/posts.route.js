const Router = require('express')

const postsController = require('../controllers/posts.controller')
const checkAuth = require('../middlewares/auth.middleware')

const router = new Router()

router.get('/', checkAuth, postsController.getPosts)

module.exports = router
