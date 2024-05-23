const db = require('../db')
const ApiError = require('../exceptions/api.error')

class ReportTemplatesService {
    async getReportTemplate(report_name) {
        const templates = await db.query(
            `
                select r.id_uuid, r.date_creation, r.report_id_uuid, r."type", r.title, r.size, r.is_selected 
                from report_templates r
                join reports r2 on r2.id_uuid = r.report_id_uuid 
                where r2.name = $1 and r.is_selected = true
                limit 1
            `,
            [report_name]
        )

        return templates.rows[0]
    }

    async selectTemplate(id) {
        const result = await db.query(
            'select report_id_uuid from report_templates where id_uuid = $1 limit 1',
            [id]
        )

        const report = await db.query(
            'select "name" from reports where id_uuid = $1 limit 1',
            [result.rows[0].report_id_uuid]
        )

        await db.query(
            `
                WITH matching_reports AS (
                    SELECT r.id_uuid
                    FROM report_templates r
                    JOIN reports r2 ON r2.id_uuid = r.report_id_uuid
                    WHERE r2.name = $1
                    ORDER BY r.date_creation DESC
                )
                UPDATE report_templates
                SET is_selected = false
                WHERE id_uuid IN (SELECT id_uuid FROM matching_reports);
            `,
            [report.rows[0].name]
        )

        await db.query(
            'UPDATE public.report_templates SET is_selected=true WHERE id_uuid = $1',
            [id]
        )
        return 'успешно обновлено'
    }

    async removeTemplate(id) {
        const result = await db.query(
            'select is_selected FROM report_templates WHERE id_uuid = $1',
            [id]
        )

        if (result.rows[0].is_selected) {
            throw ApiError.BadRequest('Нельзя удалить выбранный шаблон!')
        }

        await db.query('DELETE FROM report_templates WHERE id_uuid = $1', [id])
        return 'успешно удалено'
    }

    async getAllTemplates(report_name, limit, page, name) {
        let templates = []

        if (!name) {
            templates = await db.query(
                `
                    select r.id_uuid, r.date_creation, r.report_id_uuid, r."type", r.title, r.size, r.is_selected  
                    from report_templates r
                    join reports r2 on r2.id_uuid = r.report_id_uuid 
                    where r2.name = $1
                    order by r.date_creation desc
                `,
                [report_name]
            )
        } else {
            templates = await db.query(
                `
                    select r.id_uuid, r.date_creation, r.report_id_uuid, r."type", r.title, r.size, r.is_selected  
                    from report_templates r
                    join reports r2 on r2.id_uuid = r.report_id_uuid 
                    where r2.name = $1
                    AND LOWER(r.title) LIKE '%' || LOWER($2) || '%'
                    order by r.date_creation desc
                `,
                [report_name, name]
            )
        }

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
        await db.query(
            `
                WITH matching_reports AS (
                    SELECT r.id_uuid
                    FROM report_templates r
                    JOIN reports r2 ON r2.id_uuid = r.report_id_uuid
                    WHERE r2.name = $1
                    ORDER BY r.date_creation DESC
                )
                UPDATE report_templates
                SET is_selected = false
                WHERE id_uuid IN (SELECT id_uuid FROM matching_reports);
            `,
            [report_name]
        )

        const templates = await db.query(
            `
                INSERT INTO report_templates (id_uuid, "template", date_creation, report_id_uuid, "type", title, size, is_selected) 
                VALUES(uuid_generate_v4(), $1, NOW(), (select r.id_uuid from reports r where r.name = $2), $3, $4, $5, $6) returning *
            `,
            [template, report_name, type, title, size, true]
        )

        const newTemplate = await db.query(
            `
                select r.id_uuid, r.date_creation, r.report_id_uuid, r."type", r.title, r.size, r.is_selected  
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
                select r.id_uuid, r."template", r.date_creation, r.report_id_uuid, r."type", r.title, r.size, r.is_selected  
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
                select r.id_uuid, r.date_creation, r.report_id_uuid, r."type", r.title, r.size, r.is_selected  
                from report_templates r 
                where r.id_uuid = $1
            `,
            [id]
        )

        return result.rows[0]
    }
}

module.exports = new ReportTemplatesService()
