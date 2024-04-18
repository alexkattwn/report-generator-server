const Router = require('express')

const personalController = require('../controllers/personal.controller')
const checkAuth = require('../middlewares/auth.middleware')

const router = new Router()

router.post('/', checkAuth, personalController.getPersonal)

module.exports = router
