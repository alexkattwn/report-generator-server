const postsService = require('../services/posts.service')

class PostsController {
    async getPosts(req, res, next) {
        try {
            const { value } = req.query
            const posts = await postsService.getPosts(value)
            return res.status(200).json(posts)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new PostsController()
