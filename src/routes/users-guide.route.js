const Router = require('express')

const usersGuideController = require('../controllers/users-guide.controller')
const checkAuth = require('../middlewares/auth.middleware')

const router = new Router()

router.get('/', checkAuth, usersGuideController.getUsersGuide)
router.post('/', checkAuth, usersGuideController.uploadUsersGuide)

module.exports = router
