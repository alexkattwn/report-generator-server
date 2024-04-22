const reportsService = require('../services/reports.service')

class ReportsController {
    async getIndividualCardDose(req, res, next) {
        try {
            const { id_personal } = req.query

            const card = await reportsService.getIndividualDoseCard(id_personal)

            return res.status(200).json(card)
        } catch (e) {
            next(e)
        }
    }

    async getIDCGraphics(req, res, next) {
        try {
            const { id_personal } = req.query

            const graphics = await reportsService.getIDCGraphics(id_personal)

            return res.status(200).json(graphics)
        } catch (e) {
            next(e)
        }
    }

    async getCollectiveDoses(req, res, next) {
        try {
            const {
                start_time,
                end_time,
                start_age,
                end_age,
                sex,
                include_children,
                dose_types,
                struct,
            } = req.body

            const report = await reportsService.getCollectiveDoses(
                start_time,
                end_time,
                start_age,
                end_age,
                sex,
                include_children,
                dose_types,
                struct
            )

            return res.status(200).json(report)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ReportsController()
