const reportTemplatesService = require('../services/report-templates.service')
const ApiError = require('../exceptions/api.error')

class ReportTemplateController {
    async getReportTemplate(req, res, next) {
        try {
            const { idReport } = req.query
            const template = await reportTemplatesService.getReportTemplate(
                idReport
            )
            return res.status(200).json(template)
        } catch (e) {
            next(e)
        }
    }

    async createReportTemplate(req, res, next) {
        try {
            if (!req.files || !req.files.template) {
                throw ApiError.BadRequest('Файл не загружен')
            }

            const { idReport } = req.body
            const template = req.files.template.data

            const newTemplate =
                await reportTemplatesService.createReportTemplate(
                    idReport,
                    template
                )

            return res.status(200).json(newTemplate)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ReportTemplateController()
