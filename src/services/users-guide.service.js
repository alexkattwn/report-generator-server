const db = require('../db')

class UsersGuideService {
    async getUsersGuide(report_id) {
        const result = await db.query(
            `
                select id_uuid, title, description, encode(ug.image_light, 'base64') as image_light, report_id_uuid, sequence_number, encode(ug.image_dark, 'base64') as image_dark 
                from users_guide ug where ug.report_id_uuid = $1
            `,
            [report_id]
        )

        return result.rows.sort((a, b) => a.sequence_number - b.sequence_number)
    }

    async uploadUsersGuide(
        imageBufferLight,
        imageBufferDark,
        title,
        description,
        report_id,
        sequence_number
    ) {
        const guide = await db.query(
            `
                INSERT INTO users_guide (id_uuid, title, description, image_light, report_id_uuid, sequence_number, image_dark)
                VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, $6)
                RETURNING *
            `,
            [
                title,
                description,
                imageBufferLight,
                report_id,
                sequence_number,
                imageBufferDark,
            ]
        )

        return guide
    }
}

module.exports = new UsersGuideService()
