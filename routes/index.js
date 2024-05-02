const Router = require('express')

const router = new Router()

router.use('/auth', require('./auth.route'))
router.use('/reports', require('./reports.route'))
router.use('/posts', require('./posts.route'))
router.use('/company-structure', require('./company-structure.route'))
router.use('/personal', require('./personal.route'))
router.use('/filters', require('./filters.route'))
router.use('/users-guide', require('./users-guide.route'))

router.get('/', (_, res) => {
    res.render('start.hbs', {
        message: 'Добро пожаловать в API',
    })
})

module.exports = router
