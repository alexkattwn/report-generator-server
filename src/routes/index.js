const Router = require('express')

const router = new Router()

router.use('/auth', require('./auth.route'))
router.use('/reports', require('./reports.route'))
router.use('/posts', require('./posts.route'))
router.use('/company-structure', require('./company-structure.route'))
router.use('/personal', require('./personal.route'))
router.use('/filters', require('./filters.route'))
router.use('/users-guide', require('./users-guide.route'))
router.use('/report-templates', require('./report-templates.route'))

router.get('/', (_, res) => {
    res.send('API запущено')
    // res.render('start', {
    //     message: 'Добро пожаловать в API',
    // })
})

module.exports = router
