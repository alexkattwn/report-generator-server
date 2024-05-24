const authService = require('../services/auth.service')

class AuthController {
    async registration(req, res, next) {
        try {
            const { login, showname, identifier, code } = req.body
            await authService.registration(login, showname, identifier, code)
            return res.status(200).json('Регистрация прошла успешно')
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { login, identifier } = req.body
            const user = await authService.login(login, identifier)
            return res.status(200).json(user)
        } catch (e) {
            next(e)
        }
    }

    async checkToken(req, res, next) {
        try {
            const user = req.user
            const token = await authService.checkToken(user)
            return res.status(200).json(token)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new AuthController()
