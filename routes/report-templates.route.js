const Router = require('express')

const reportTemplatesController = require('../controllers/report-templates.controller')
const checkAuth = require('../middlewares/auth.middleware')

const router = new Router()

router.get('/', checkAuth, reportTemplatesController.getReportTemplate)
router.get('/all', checkAuth, reportTemplatesController.getAllTemplates)
router.delete('/', checkAuth, reportTemplatesController.removeTemplate)
router.post('/', checkAuth, reportTemplatesController.createReportTemplate)
router.get(
    '/download/:id',
    checkAuth,
    reportTemplatesController.downloadReportTemplate
)

router.get('/:id', checkAuth, reportTemplatesController.getById)

module.exports = router
