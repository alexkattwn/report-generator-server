const Router = require('express')

const reportsController = require('../controllers/reports.controller')
const checkAuth = require('../middlewares/auth.middleware')

const router = new Router()

router.get(
    '/individual-dose-card',
    checkAuth,
    reportsController.getIndividualCardDose
)
router.get('/idc-graphics', checkAuth, reportsController.getIDCGraphics)
router.post(
    '/collective-doses',
    checkAuth,
    reportsController.getCollectiveDoses
)

module.exports = router
