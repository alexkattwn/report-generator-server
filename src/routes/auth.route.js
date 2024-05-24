const Router = require('express')

const authController = require('../controllers/auth.controller')
const checkAuth = require('../middlewares/auth.middleware')

const router = new Router()

router.post('/sign-up', authController.registration)
router.post('/sign-in', authController.login)
router.get('/check-token', checkAuth, authController.checkToken)

module.exports = router
