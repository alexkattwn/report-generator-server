const db = require('../db')

class ReportTemplatesService {
    async getReportTemplate(idReport) {
        const templates = await db.query(
            `
                SELECT id_uuid, encode(r."template", 'base64') as report_template, r.date_creation, r.report_id_uuid 
                FROM report_templates r where r.report_id_uuid = $1 limit 1
            `,
            [idReport]
        )
        return templates.rows
    }

    async createReportTemplate(idReport, template) {
        const newTemplate = await db.query(
            `
                INSERT INTO report_templates (id_uuid, "template", date_creation, report_id_uuid) 
                VALUES(uuid_generate_v4(), $1, NOW(), $2)
            `,
            [template, idReport]
        )

        return newTemplate
    }
}

module.exports = new ReportTemplatesService()
