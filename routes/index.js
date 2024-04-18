const Router = require('express')

const authRouter = require('./auth.route')
const reportsRouter = require('./reports.route')
const postsRouter = require('./posts.route')
const companyStructureRouter = require('./company-structure.route')
const personalRouter = require('./personal.route')
const filtersRouter = require('./filters.route')

const router = new Router()

router.use('/auth', authRouter)
router.use('/reports', reportsRouter)
router.use('/posts', postsRouter)
router.use('/company-structure', companyStructureRouter)
router.use('/personal', personalRouter)
router.use('/filters', filtersRouter)

router.get('/', (_, res) => {
    res.render('start.hbs', {
        message: 'Добро пожаловать в API',
    })
})

module.exports = router
