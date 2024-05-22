const db = require('../db')

class ReportTemplatesService {
    async getReportTemplate(report_name) {
        const templates = await db.query(
            `
                select r.id_uuid, r.date_creation, r.report_id_uuid, r."type", r.title, r.size 
                from report_templates r
                join reports r2 on r2.id_uuid = r.report_id_uuid 
                where r2.name = $1
                order by r.date_creation desc
                limit 1
            `,
            [report_name]
        )

        return templates.rows[0]
    }

    async getAllTemplates(report_name, name, limit, page) {
        const templates = await db.query(
            `
                select r.id_uuid, r.date_creation, r.report_id_uuid, r."type", r.title, r.size 
                from report_templates r
                join reports r2 on r2.id_uuid = r.report_id_uuid 
                where r2.name = $1
                order by r.date_creation desc
            `,
            [report_name]
        )

        const data = templates.rows

        const totalRecords = data.length
        const totalPages = Math.ceil(totalRecords / limit)

        const startIndex = (page - 1) * limit
        const endIndex = Math.min(startIndex + limit - 1, totalRecords - 1)
        const currentPageData = data.slice(startIndex, endIndex + 1)

        return {
            count: totalPages,
            data: currentPageData,
        }
    }

    async createReportTemplate(report_name, template, type, title, size) {
        const templates = await db.query(
            `
                INSERT INTO report_templates (id_uuid, "template", date_creation, report_id_uuid, "type", title, size) 
                VALUES(uuid_generate_v4(), $1, NOW(), (select r.id_uuid from reports r where r.name = $2), $3, $4, $5) returning *
            `,
            [template, report_name, type, title, size]
        )

        const newTemplate = await db.query(
            `
                select r.id_uuid, r.date_creation, r.report_id_uuid, r."type", r.title, r.size 
                from report_templates r 
                where r.id_uuid = $1
            `,
            [templates.rows[0].id_uuid]
        )

        return newTemplate.rows[0]
    }

    async downloadReportTemplate(id) {
        const result = await db.query(
            `
                select r.id_uuid, r."template", r.date_creation, r.report_id_uuid, r."type", r.title, r.size 
                from report_templates r 
                where r.id_uuid = $1
            `,
            [id]
        )

        return result.rows[0]
    }

    async getById(id) {
        const result = await db.query(
            `
                select r.id_uuid, r.date_creation, r.report_id_uuid, r."type", r.title, r.size 
                from report_templates r 
                where r.id_uuid = $1
            `,
            [id]
        )

        return result.rows[0]
    }
}

module.exports = new ReportTemplatesService()
