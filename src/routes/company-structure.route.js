const Router = require('express')

const companyStructureController = require('../controllers/company-structure.controller')
const checkAuth = require('../middlewares/auth.middleware')

const router = new Router()

router.get('/', checkAuth, companyStructureController.getCompanyStructure)

module.exports = router
