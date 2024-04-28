const db = require('../db')
const ApiError = require('../exceptions/api.error')

class FiltersService {
    async getFilters(name_report, value) {
        let filters
        if (!value) {
            filters = await db.query(
                `
                    select r.id_uuid as id_report, r."name" as name_report, rf."name" as name_filter, rf.parameters, rf.id_uuid as id_filter   
                    from report_filters rf
                    join reports r on r.id_uuid = rf.reports_id_uuid 
                    where r.name = $1 
                `,
                [name_report]
            )
        } else {
            filters = await db.query(
                `
                    SELECT 
                        r.id_uuid AS id_report, 
                        r."name" AS name_report, 
                        rf."name" AS name_filter, 
                        rf.parameters, 
                        rf.id_uuid AS id_filter   
                    FROM 
                        report_filters rf
                    JOIN 
                        reports r ON r.id_uuid = rf.reports_id_uuid 
                    WHERE 
                        r.name = $1 
                        AND LOWER(rf.name) LIKE '%' || LOWER($2) || '%'
                `,
                [name_report, value]
            )
        }

        return filters.rows
    }

    async createFilter(name_report, name, parameters) {
        const filter = await db.query(
            `
                select rf.id_uuid, rf."name", rf.reports_id_uuid, rf.parameters  from  report_filters rf
                join reports r on r.id_uuid = rf.reports_id_uuid 
                where rf."name" = $1 and r."name" = $2
            `,
            [name, name_report]
        )

        if (filter.rows[0]) {
            throw ApiError.BadRequest('Фильтр с таким названием уже существует')
        }

        await db.query(
            `
                INSERT INTO report_filters (id_uuid, "name", reports_id_uuid, parameters) 
                VALUES(uuid_generate_v4(), $1, (select id_uuid  from reports where "name" = $2), $3) RETURNING *
            `,
            [name, name_report, parameters]
        )

        const filters = await db.query(
            `
                select r.id_uuid as id_report, r."name" as name_report, rf."name" as name_filter, rf.parameters, rf.id_uuid as id_filter
                from report_filters rf
                join reports r on r.id_uuid = rf.reports_id_uuid
                where r.name = $1
            `,
            [name_report]
        )

        return filters.rows
    }

    async removeFilter(id_filter, name_report) {
        await db.query('DELETE FROM public.report_filters WHERE id_uuid = $1', [
            id_filter,
        ])

        const filters = await db.query(
            `
                select r.id_uuid as id_report, r."name" as name_report, rf."name" as name_filter, rf.parameters, rf.id_uuid as id_filter
                from report_filters rf
                join reports r on r.id_uuid = rf.reports_id_uuid
                where r.name = $1
            `,
            [name_report]
        )

        return filters.rows
    }
}

module.exports = new FiltersService()
