const Router = require('express')

const reportTemplatesController = require('../controllers/report-templates.controller')
const checkAuth = require('../middlewares/auth.middleware')

const router = new Router()

router.get('/', checkAuth, reportTemplatesController.getReportTemplate)
router.post('/', checkAuth, reportTemplatesController.createReportTemplate)

module.exports = router
