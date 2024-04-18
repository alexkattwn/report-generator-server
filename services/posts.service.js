const db = require('../db')

class PostsService {
    async getPosts(value) {
        let posts = []
        if (!value) {
            posts = await db.query('SELECT * FROM personal_posts')
        } else {
            posts = await db.query(
                `SELECT * FROM personal_posts WHERE LOWER(name) LIKE '%' || LOWER($1) || '%'`,
                [value]
            )
        }

        return posts.rows
    }
}

module.exports = new PostsService()
