const personalService = require('../services/personal.service')

class PersonalController {
    async getPersonal(req, res, next) {
        try {
            const {
                struct,
                post,
                pass_sfz,
                personal_number,
                doc_number,
                contacts,
                page,
            } = req.body

            const { fio } = req.query

            const limit = 5

            const personal = await personalService.getPersonal(
                struct,
                post,
                pass_sfz,
                personal_number,
                doc_number,
                contacts,
                limit,
                page,
                fio
            )
            return res.status(200).json(personal)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new PersonalController()
