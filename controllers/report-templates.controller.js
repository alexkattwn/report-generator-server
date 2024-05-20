const { Readable } = require('stream')

const reportTemplatesService = require('../services/report-templates.service')
const ApiError = require('../exceptions/api.error')

class ReportTemplateController {
    async getReportTemplate(req, res, next) {
        try {
            const { report_name } = req.query
            const template = await reportTemplatesService.getReportTemplate(
                report_name
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

            const { report_name } = req.body

            const template = req.files.template.data
            const fileName = Buffer.from(
                req.files.template.name,
                'latin1'
            ).toString('utf-8')

            const type = fileName.substring(fileName.lastIndexOf('.') + 1)
            const title = fileName.split('.')[0]

            const newTemplate =
                await reportTemplatesService.createReportTemplate(
                    report_name,
                    template,
                    type,
                    title
                )

            return res.status(200).json(newTemplate)
        } catch (e) {
            next(e)
        }
    }

    async downloadReportTemplate(req, res, next) {
        try {
            const { id } = req.params
            const file = await reportTemplatesService.downloadReportTemplate(id)

            const fileData = file.template
            const fileType = file.type

            res.setHeader(
                'Content-disposition',
                'attachment; filename=your_file.' + fileType
            )
            res.setHeader('Content-type', 'application/octet-stream')

            const fileStream = new Readable()
            fileStream.push(fileData)
            fileStream.push(null)

            fileStream.pipe(res)
        } catch (e) {
            next(e)
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params
            const template = await reportTemplatesService.getById(id)

            return res.status(200).json(template)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ReportTemplateController()
