const db = require('../db')
const calculateLevenshteinDistance = require('../utils/calculateLevenshteinDistance')

class PersonalService {
    async getPersonal(
        struct,
        post,
        pass_sfz,
        personal_number,
        doc_number,
        contacts,
        limit,
        page,
        fio
    ) {
        const personal = await db.query(
            `
            SELECT DISTINCT
                p.id_uuid,
                p.surname,
                p.name,
                p.patronymic,
                CASE WHEN p.sex::VARCHAR = 'f' THEN 'Жен.'ELSE 'Муж.' END as sex,
                p.birthday,
                pph.photo,
                pp."name" as name_post,
                pp.code as code_post,
                pc.personnel_number,
                pc.pass_sfz,
                CASE WHEN MAX (tda.set_datetime) is not null THEN 'Да' ELSE 'Нет' END as on_tda
            FROM
                personal p
                LEFT JOIN personal_photo pph ON pph.personal_id_uuid = p.id_uuid
                LEFT JOIN personal_career pc ON pc.personal_id_uuid = p.id_uuid
                LEFT JOIN tdk_dose_account tda ON tda.career_id_uuid = pc.id_uuid
                LEFT JOIN personal_idcards pi ON pi.personal_id_uuid = p.id_uuid
                LEFT JOIN personal_posts pp on pc.post_id_uuid = pp.id_uuid 
            WHERE
                CASE WHEN $1::uuid is null THEN true ELSE cs_in_parent_cs(pc.company_structure_id_uuid, $1) END
                AND CASE WHEN $2::uuid is null THEN true ELSE pc.post_id_uuid = $2 END
                AND CASE WHEN $3::varchar is null THEN true ELSE pc.pass_sfz LIKE '%' || $3 || '%' END
                AND CASE WHEN $4::varchar is null THEN true ELSE pc.personnel_number LIKE '%' || $4 || '%' END
                AND CASE WHEN $5::varchar is null THEN true ELSE pi.number LIKE '%' || $5 || '%' END
                AND CASE WHEN $6::varchar is null THEN true ELSE p.contacts LIKE '%' || $6 || '%' END

            GROUP BY p.id_uuid, p.surname, p.name, p.patronymic, sex, p.birthday, pph.photo, pp."name", pp.code, pc.personnel_number, pc.pass_sfz
            `,
            [struct, post, pass_sfz, personal_number, doc_number, contacts]
        )

        let data = personal.rows

        if (fio) {
            data = this.filterByFullNameLevenshtein(personal.rows, fio)
        }

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

    filterByFullNameLevenshtein(personalData, fullName, maxDistance = 2) {
        const parts = fullName
            .split(' ')
            .map((part) => part.toLowerCase().trim())

        return personalData.filter((person) => {
            for (const part of parts) {
                if (
                    part &&
                    (calculateLevenshteinDistance(
                        part,
                        person.surname.toLowerCase()
                    ) <= maxDistance ||
                        calculateLevenshteinDistance(
                            part,
                            person.name.toLowerCase()
                        ) <= maxDistance ||
                        calculateLevenshteinDistance(
                            part,
                            person.patronymic.toLowerCase()
                        ) <= maxDistance)
                ) {
                    continue
                }
                return false
            }
            return true
        })
    }
}

module.exports = new PersonalService()
