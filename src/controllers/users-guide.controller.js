const usersGuideService = require('../services/users-guide.service')
const ApiError = require('../exceptions/api.error')

class UsersGuideController {
    async getUsersGuide(req, res, next) {
        try {
            const { report_id } = req.query

            const guide = await usersGuideService.getUsersGuide(report_id)

            return res.status(200).json(guide)
        } catch (e) {
            next(e)
        }
    }

    async uploadUsersGuide(req, res, next) {
        try {
            if (!req.files || !req.files.image_light || !req.files.image_dark) {
                throw ApiError.BadRequest('Файл не загружен')
            }

            const { title, description, report_id, sequence_number } = req.body

            const imageBufferLight = req.files.image_light.data
            const imageBufferDark = req.files.image_dark.data

            const guide = await usersGuideService.uploadUsersGuide(
                imageBufferLight,
                imageBufferDark,
                title,
                description,
                report_id,
                sequence_number
            )

            return res.status(200).json(guide)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UsersGuideController()
