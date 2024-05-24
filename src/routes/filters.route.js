const Router = require('express')

const filtersController = require('../controllers/filters.controller')
const checkAuth = require('../middlewares/auth.middleware')

const router = new Router()

router.get('/', checkAuth, filtersController.getFilters)
router.post('/', checkAuth, filtersController.createFilter)
router.delete('/', checkAuth, filtersController.removeFilter)

module.exports = router
