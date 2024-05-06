const db = require('../db')
const calculateMonthlySum = require('../utils/calculateMonthlySum')
const dataGraphics = require('../utils/data')
const dataCollectiveDoses = require('../utils/dataColDos')

class ReportsService {
    async getIndividualDoseCard(id_personal) {
        const personInfo = await db.query(
            `
            SELECT DISTINCT
                p.id_uuid,
                p.surname,
                p.name,
                p.patronymic,
                CASE WHEN p.sex::VARCHAR = 'f' THEN 'Жен.'ELSE 'Муж.' END as sex,
                p.birthday,
                pph.photo,
                CASE WHEN MAX (tda.set_datetime) is not null THEN 'Да' ELSE 'Нет' END as on_tda
            FROM
                personal p
                LEFT JOIN personal_photo pph ON pph.personal_id_uuid = p.id_uuid
                LEFT JOIN personal_career pc ON pc.personal_id_uuid = p.id_uuid
                LEFT JOIN tdk_dose_account tda ON tda.career_id_uuid = pc.id_uuid
                LEFT JOIN personal_idcards pi ON pi.personal_id_uuid = p.id_uuid
            WHERE
                CASE WHEN $1::uuid is null THEN true ELSE p.id_uuid = $1 END
            GROUP BY p.id_uuid, p.surname, p.name, p.patronymic, sex, p.birthday, pph.photo
            `,
            [id_personal]
        )

        const document = await db.query(
            `
            SELECT 
                CONCAT (pit.name, ', ', c.name, ', ', pi.number, ', ', to_char(pi.grant_date,'DD.MM.YYYY')) as doc
            FROM 
                personal p    
                LEFT JOIN personal_idcards pi ON pi.personal_id_uuid = p.id_uuid
                LEFT JOIN personal_idcard_types pit ON pit.id_uuid = pi.idcard_type_id_uuid
                LEFT JOIN country c ON c.id_uuid = pi.country_id_uuid
            WHERE
                cast (p.id_uuid as VARCHAR) = $1
            `,
            [id_personal]
        )

        const iRDAccident = await db.query(
            `
            WITH res_full as (SELECT DISTINCT
                mvnv.start_datetime,
                mvnv.end_datetime,
                get_place_by_mvnv_id_uuid (mvnv.id_uuid) as place,
                CONCAT( mnv.code,', ',mnv.unit_of_measure) AS mv_name,
                mv_calc_person_value(p.id_uuid,mvnv.start_datetime, mvnv.end_datetime,mnv.id_uuid,false,false,true,true,true,true,true,true,true) AS value,
                mnv.precision AS mnv_precision
            FROM
                personal p
                LEFT JOIN mv_value_normalized_value mvnv ON mvnv.person_id_uuid = p.id_uuid
                LEFT JOIN mv_normalized_value mnv ON mvnv.normalized_value_id_uuid = mnv.id_uuid
            WHERE
                cast (p.id_uuid as VARCHAR) = $1
            AND
                mvnv.emergency_situation = true)
            
                SELECT 
                    COALESCE (res.start_datetime, res_null.start_datetime) as start_datetime,
                    COALESCE (res.end_datetime, res_null.end_datetime) as end_datetime,
                    COALESCE (res.place, res_null.place) as place,
                    COALESCE (res.mv_name, res_null.mv_name) as mv_name,
                    COALESCE (res.value, res_null.value) as value,
                    COALESCE (res.mnv_precision, res_null.mnv_precision) as mnv_precision
                FROM (SELECT
                    null::timestamptz as start_datetime,
                    null::timestamptz as end_datetime,
                    '-'::VARCHAR as place,
                    'Код НВ'::varchar AS mv_name,
                    null::NUMERIC AS value,
                    null::integer AS mnv_precision) res_null
                    LEFT JOIN res_full res ON true
            `,
            [id_personal]
        )

        const iRDBeforeWork = await db.query(
            `
            WITH res_full as (SELECT DISTINCT
                mvnv.start_datetime,
                mvnv.end_datetime,
                get_place_by_mvnv_id_uuid (mvnv.id_uuid) as place,
                CONCAT( mnv.code,', ',mnv.unit_of_measure) AS mv_name,
                mv_calc_person_value(p.id_uuid,mvnv.start_datetime, mvnv.end_datetime,mnv.id_uuid,false,false,true,false,false,false,false,false,false) AS value,
                mnv.precision AS mnv_precision,
                mvnv.uncertainty
            FROM
                personal p
                LEFT JOIN mv_value_normalized_value mvnv ON mvnv.person_id_uuid = p.id_uuid
                LEFT JOIN mv_normalized_value mnv ON mvnv.normalized_value_id_uuid = mnv.id_uuid
            WHERE
                cast (p.id_uuid as VARCHAR) = $1
            AND
                mvnv.emergency_situation = false
            AND
                mvnv.tdk_doses_before_job_id_uuid is not null)
                
            SELECT 
                    COALESCE (res.start_datetime, res_null.start_datetime) as start_datetime,
                    COALESCE (res.end_datetime, res_null.end_datetime) as end_datetime,
                    COALESCE (res.place, res_null.place) as place,
                    COALESCE (res.mv_name, res_null.mv_name) as mv_name,
                    COALESCE (res.value, res_null.value) as value,
                    COALESCE (res.mnv_precision, res_null.mnv_precision) as mnv_precision,
                    COALESCE (res.uncertainty, res_null.value) as uncertainty
                FROM (SELECT
                    null::timestamptz as start_datetime,
                    null::timestamptz as end_datetime,
                    '-'::VARCHAR as place,
                    'Код НВ'::varchar AS mv_name,
                    null::NUMERIC AS value,
                    null::integer AS mnv_precision) res_null
                    LEFT JOIN res_full res ON true
            `,
            [id_personal]
        )

        const listPeriods = await db.query(
            `
            SELECT * 
            FROM get_data_for_report_card_personal($1::UUID)
            ORDER BY number, year
            `,
            [id_personal]
        )

        const dosimetricRegistration = await db.query(
            `
            SELECT 
                tda.set_datetime,
                tda.dismiss_datetime,
                get_agg_shortname_company_by_company_id_without_parent(cs.id_uuid) as struct,
                pp.name
            FROM
                tdk_dose_account tda
                LEFT JOIN personal_career pc ON pc.id_uuid = tda.career_id_uuid
                LEFT JOIN companies_structure cs ON cs.id_uuid = pc.company_structure_id_uuid
                LEFT JOIN personal_posts pp ON pp.id_uuid = pc.post_id_uuid
            WHERE 
                cast (pc.personal_id_uuid as VARCHAR)= $1
            `,
            [id_personal]
        )

        const iRDBusinessTrips = await db.query(
            `
            WITH res_full as (SELECT DISTINCT
                mvnv.start_datetime,
                mvnv.end_datetime,
                get_place_by_mvnv_id_uuid (mvnv.id_uuid) as place,
                CONCAT( mnv.code,', ',mnv.unit_of_measure) AS mv_name,
                tbd.exposure_circumstances as work,
                mv_calc_person_value(p.id_uuid,mvnv.start_datetime, mvnv.end_datetime,mnv.id_uuid,false,false,false,true,false,false,false,false,false) AS value,
                mnv.precision AS mnv_precision,
                mvnv.uncertainty
            FROM
                personal p
                LEFT JOIN mv_value_normalized_value mvnv ON mvnv.person_id_uuid = p.id_uuid
                LEFT JOIN mv_normalized_value mnv ON mvnv.normalized_value_id_uuid = mnv.id_uuid
                LEFT JOIN tdk_business_doses tbd ON tbd.id_uuid = mvnv.tdk_business_doses_id_uuid
            WHERE
                cast (p.id_uuid as VARCHAR) = $1
            AND
                mvnv.emergency_situation = false
            AND
                mvnv.tdk_business_doses_id_uuid is not null)
            
                SELECT 
                    COALESCE (res.start_datetime, res_null.start_datetime) as start_datetime,
                    COALESCE (res.end_datetime, res_null.end_datetime) as end_datetime,
                    COALESCE (res.place, res_null.place) as place,
                    COALESCE (res.mv_name, res_null.mv_name) as mv_name,
                    COALESCE (res.work, res_null.work) as work,
                    COALESCE (res.value, res_null.value) as value,
                    COALESCE (res.mnv_precision, res_null.mnv_precision) as mnv_precision,
                    COALESCE (res.uncertainty, res_null.value) as uncertainty
                FROM (SELECT
                    null::timestamptz as start_datetime,
                    null::timestamptz as end_datetime,
                    '-'::VARCHAR as place,
                    'Код НВ'::varchar AS mv_name,
                    '-'::VARCHAR as work,
                    null::NUMERIC AS value,
                    null::integer AS mnv_precision) res_null
                    LEFT JOIN res_full res ON true
            `,
            [id_personal]
        )

        const iRDMainPlaceWork = await db.query(
            `
            WITH res_full as (SELECT DISTINCT
                mvnv.start_datetime,
                mvnv.end_datetime,
                mvnv.tdk_additional_periods_id_uuid,
                CONCAT( mnv.code,', ',mnv.unit_of_measure) AS mv_name,
                mvnv.value,
                mvnv.uncertainty,
                mnv.precision AS mnv_precision, 
                tucm.code as model_name
            FROM
                personal p
                LEFT JOIN mv_value_normalized_value mvnv ON mvnv.person_id_uuid = p.id_uuid
                LEFT JOIN mv_normalized_value mnv ON mvnv.normalized_value_id_uuid = mnv.id_uuid
                LEFT JOIN tdk_business_doses tbd ON tbd.id_uuid = mvnv.tdk_business_doses_id_uuid
                LEFT JOIN tdk_periods tp ON tp.id_uuid = mvnv.tdk_additional_periods_id_uuid OR tp.id_uuid = mvnv.tdk_fixed_periods_id_uuid
                LEFT JOIN tdk_dose_account_zone tdaz ON tdaz.id_uuid = tp.tdk_dose_account_zone_id_uuid
                JOIN tdk_unit_carry_model tucm ON tucm.id_uuid = tp.tdk_unit_carry_model_id_uuid OR tucm.id_uuid = tdaz.unit_carry_model_id_uuid
            WHERE
                cast (p.id_uuid as VARCHAR) = $1
            AND
                mvnv.emergency_situation = false
            AND
                mvnv.odk_access_id_uuid is null 
            AND
                (	mvnv.tdk_additional_periods_id_uuid is not null
                OR
                    mvnv.tdk_fixed_periods_id_uuid is not null
                OR
                    mvnv.hrc_examination_id_uuid is not null
                OR
                    mvnv.hrc_nuclid_intake_id_uuid is not null
                ))
                
                SELECT 
                    COALESCE (res.start_datetime, res_null.start_datetime) as start_datetime,
                    COALESCE (res.end_datetime, res_null.end_datetime) as end_datetime,
                    CASE WHEN res.tdk_additional_periods_id_uuid is NOT null THEN '+' ELSE ' ' END as additional,
                    COALESCE (model_name, '-') as model_name,
                    COALESCE (res.mv_name, res_null.mv_name) as mv_name,
                    COALESCE (res.value, res_null.value) as value,
                    COALESCE (res.uncertainty, res_null.value) as uncertainty,		
                    COALESCE (res.mnv_precision, res_null.mnv_precision) as mnv_precision
                FROM (SELECT
                    null::timestamptz as start_datetime,
                    null::timestamptz as end_datetime,
                    'Код НВ'::varchar AS mv_name,
                    null::NUMERIC AS value,
                    null::integer AS mnv_precision) res_null
                    LEFT JOIN res_full res ON true
            ORDER BY start_datetime
            `,
            [id_personal]
        )

        const littleObj = await db.query(
            `
            SELECT DISTINCT
                CONCAT( mnv.code,', ', '[',mnv.unit_of_measure,']') AS mv_name,
                '-' as t,
                mnv.name
            FROM
                personal p
                LEFT JOIN mv_value_normalized_value mvnv ON mvnv.person_id_uuid = p.id_uuid
                LEFT JOIN mv_normalized_value mnv ON mvnv.normalized_value_id_uuid = mnv.id_uuid
            WHERE
                cast (p.id_uuid as VARCHAR) = $1
            `,
            [id_personal]
        )

        const info = await db.query(
            `
            SELECT DISTINCT
                tucm.code AS model_code,
                '-' as t,
                tucm.name
            FROM
                personal p
                LEFT JOIN mv_value_normalized_value mvnv ON mvnv.person_id_uuid = p.id_uuid
                LEFT JOIN mv_normalized_value mnv ON mvnv.normalized_value_id_uuid = mnv.id_uuid
                LEFT JOIN tdk_periods tp ON tp.id_uuid = mvnv.tdk_additional_periods_id_uuid OR tp.id_uuid = mvnv.tdk_fixed_periods_id_uuid
                LEFT JOIN tdk_dose_account_zone tdaz ON tdaz.id_uuid = tp.tdk_dose_account_zone_id_uuid
                JOIN tdk_unit_carry_model tucm ON tucm.id_uuid = tp.tdk_unit_carry_model_id_uuid OR tucm.id_uuid = tdaz.unit_carry_model_id_uuid
            WHERE
                cast (p.id_uuid as VARCHAR) = $1
            `,
            [id_personal]
        )

        const headerInfo = await db.query(
            `
            SELECT DISTINCT
                p.id_uuid,
                CONCAT (p.surname, ' ', p.name, ' ', p.patronymic) as fio,
                to_char (p.birthday, 'DD.MM.YYYY') as birthday,
                p.contacts,
                to_char (min (tda.set_datetime), 'DD.MM.YYYY') as min_datetime,
                to_char (CASE WHEN max (CASE WHEN tda.dismiss_datetime is null THEN '31.12.3000'::timestamptz ELSE tda.dismiss_datetime END) = '31.12.3000' THEN null ELSE max (tda.dismiss_datetime) END, 'DD.MM.YYYY') as max_datetime,
                get_system_variable_value_by_code('gen.certificate') as e_sertificate
            FROM personal p
                LEFT JOIN personal_career pc ON pc.personal_id_uuid = p.id_uuid
                LEFT JOIN personal_posts pp ON pp.id_uuid = pc.post_id_uuid
                LEFT JOIN personal_idcards pi ON pi.personal_id_uuid = p.id_uuid
                LEFT JOIN tdk_dose_account tda ON tda.career_id_uuid = pc.id_uuid
            WHERE
                cast (p.id_uuid as VARCHAR) = $1
            GROUP BY p.id_uuid, fio, p.birthday, p.contacts
            `,
            [id_personal]
        )

        //const lastYearValues = await this.getIDCInfoGraphics(id_personal)

        return {
            personInfo: personInfo.rows[0],
            document: document.rows[0],
            iRDAccident: iRDAccident.rows[0],
            iRDBeforeWork: iRDBeforeWork.rows[0],
            listPeriods: listPeriods.rows[0],
            iRDBusinessTrips: iRDBusinessTrips.rows[0],
            dosimetricRegistration: dosimetricRegistration.rows[0],
            iRDMainPlaceWork: iRDMainPlaceWork.rows[0],
            littleObj: littleObj.rows[0],
            info: info.rows[0],
            headerInfo: headerInfo.rows[0],
            //lastYearValues: lastYearValues[0],
        }
    }

    async getIDCGraphics(id_personal) {
        const { areaIDCData, barIDCData, pieIDCData } = dataGraphics
        const area = areaIDCData.find((a) => a.id_uuid === id_personal)
        const bar = barIDCData.find((a) => a.id_uuid === id_personal)
        const pie = pieIDCData.find((a) => a.id_uuid === id_personal)

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ area, bar, pie })
            }, 0)
        })
    }

    async getIDCInfoGraphics(id_personal) {
        const values = await db.query(
            `
                select p.id_uuid, mvnv.start_datetime, mvnv.end_datetime, p.surname, mvnv.value, tz."name", tz.code, mnv.sign, mnv.unit_of_measure 
                from personal p 
                join mv_value_normalized_value mvnv on mvnv.person_id_uuid = p.id_uuid 
                join tdk_zone tz on tz.id_uuid = mvnv.tdk_zone_id_uuid 
                join mv_normalized_value mnv on mnv.id_uuid = mvnv.normalized_value_id_uuid 
                where p.id_uuid = $1
            `,
            [id_personal]
        )

        return calculateMonthlySum(values.rows)
    }

    async getCollectiveDoses(
        start_time,
        end_time,
        start_age,
        end_age,
        sex,
        include_children,
        dose_types,
        struct
    ) {
        console.log(
            start_time,
            end_time,
            start_age,
            end_age,
            sex,
            include_children,
            dose_types,
            struct
        )
        const firstData = await db.query(
            `
            SELECT *
                FROM (
                    SELECT
                        cs.id_uuid AS id_uuid,
                        cs.name AS cs_name,
                        a.code_unit AS mnv_code,
                        TRUNC(a.sum_value, a.prec) AS sum_value,
                        TRUNC(a.max_value, a.prec) AS max_value,
                        TRUNC(a.avg_value, a.prec) AS avg_value,
                        get_count_dose_account_by_company(cs_id_uuid, $1::VARCHAR, $2::VARCHAR, $3, $4, $5, $6 != 'n') AS cnt_du,
                        get_count_mv_by_company(cs_id_uuid, $1::VARCHAR, $2::VARCHAR, $3, $4, $5, $7, $6 != 'n') AS cnt_mv
                    FROM (
                        WITH all_data AS (
                            SELECT
                                p.id_uuid AS p_id_uuid,
                                mnv.code,
                                CONCAT(mnv.code, ', ', mnv.unit_of_measure) AS code_unit,
                                mnv.precision AS prec,
                                get_children_cs_by_parent_and_current(cs.id_uuid, $8::UUID) AS cs_id_uuid,
                                SUM(
                                    mv_calc_person_value(
                                        p.id_uuid,
                                        $1::TIMESTAMP,
                                        $2::TIMESTAMP,
                                        mnv.id_uuid,
                                        FALSE,
                                        $7 LIKE '%odk%',
                                        $7 LIKE '%before%',
                                        $7 LIKE '%busines%',
                                        $7 LIKE '%fixed%',
                                        $7 LIKE '%add%',
                                        $7 LIKE '%exam%',
                                        $7 LIKE '%fixed%'
                                    )
                                ) AS valueSum
                            FROM
                                personal p
                                JOIN personal_career pc ON pc.personal_id_uuid = p.id_uuid
                                JOIN companies_structure cs ON cs.id_uuid = pc.company_structure_id_uuid
                                JOIN mv_normalized_value mnv ON TRUE
                            WHERE
                                pc.start_datetime <= $2::TIMESTAMP
                                AND (pc.end_datetime IS NULL OR pc.end_datetime >= $1::TIMESTAMP)
                                AND get_children_cs_by_parent_and_current(cs.id_uuid, $8::UUID) IS NOT NULL
                            GROUP BY
                                p.id_uuid,
                                mnv.code,
                                cs.id_uuid,
                                mnv.id_uuid
                        )
                        SELECT
                            all_data.prec,
                            cs_id_uuid,
                            all_data.code AS mnv_code,
                            all_data.code_unit,
                            SUM(valuesum) AS sum_value,
                            AVG(valuesum) AS avg_value,
                            MAX(valuesum) AS max_value
                        FROM
                            all_data
                            JOIN companies_structure cs ON cs.id_uuid = cs_id_uuid
                        WHERE
                            (valuesum IS NOT NULL OR all_data.code LIKE 'E')
                        GROUP BY
                            cs_id_uuid,
                            all_data.code,
                            all_data.prec,
                            all_data.code_unit
                        ORDER BY
                            cs_id_uuid
                    ) a
                    JOIN companies_structure cs ON cs.id_uuid = a.cs_id_uuid
                ) b
                WHERE
                    cnt_du != 0;
            `,
            [
                start_time,
                end_time,
                start_age,
                end_age,
                sex,
                include_children,
                dose_types,
                struct,
            ]
        )

        const secondData = await db.query(
            `
            SELECT *
                FROM (
                    SELECT
                        cs.id_uuid AS ps_id,
                        cs.name AS company,
                        a.code_unit AS code,
                        a.precision AS precision,
                        a.sum_value AS valuesum,
                        a.max_value AS valuemax,
                        a.avg_value AS valueavg,
                        get_count_mv_by_company(
                            cs_id_uuid,
                            $1 AS start_time,
                            $2 AS end_time,
                            $3 AS start_age,
                            $4 AS end_age,
                            $5 AS sex,
                            $6 AS dose_type,
                            cs_id_uuid != $7::UUID AS selected_object
                        ) AS cnt_mv,
                        get_count_dose_account_by_company(
                            cs_id_uuid,
                            $1 AS start_time,
                            $2 AS end_time,
                            $3 AS start_age,
                            $4 AS end_age,
                            $5 AS sex,
                            cs_id_uuid != $7::UUID AS selected_object
                        ) AS cnt_du
                    FROM (
                        WITH all_data AS (
                            SELECT
                                p.id_uuid AS p_id_uuid,
                                mnv.code,
                                CONCAT(mnv.code, ', ', mnv.unit_of_measure) AS code_unit,
                                mnv.precision,
                                CASE
                                    WHEN cs.id_uuid = $7::UUID THEN cs.id_uuid
                                    ELSE get_children_cs_by_parent_and_current(cs.id_uuid, $7::UUID)
                                END AS cs_id_uuid,
                                SUM(
                                    mv_calc_person_value(
                                        p.id_uuid,
                                        $1::TIMESTAMP AS start_time,
                                        $2::TIMESTAMP AS end_time,
                                        mnv.id_uuid,
                                        FALSE,
                                        $6 LIKE '%odk%' AS is_odk,
                                        $6 LIKE '%before%' AS is_before,
                                        $6 LIKE '%busines%' AS is_busines,
                                        $6 LIKE '%fixed%' AS is_fixed,
                                        $6 LIKE '%add%' AS is_add,
                                        $6 LIKE '%exam%' AS is_exam,
                                        $6 LIKE '%fixed%' AS is_fixed
                                    )
                                ) AS valueSum
                            FROM
                                personal p
                                JOIN personal_career pc ON pc.personal_id_uuid = p.id_uuid
                                JOIN companies_structure cs ON cs.id_uuid = pc.company_structure_id_uuid
                                JOIN mv_normalized_value mnv ON TRUE
                            WHERE
                                pc.start_datetime <= $2::TIMESTAMP
                                AND (pc.end_datetime IS NULL OR pc.end_datetime >= $1::TIMESTAMP)
                                AND (
                                    get_children_cs_by_parent_and_current(cs.id_uuid, $7::UUID) IS NOT NULL
                                    OR cs.id_uuid = $7::UUID
                                )
                            GROUP BY
                                p.id_uuid,
                                mnv.code,
                                cs.id_uuid,
                                mnv.id_uuid
                        )
                        SELECT
                            all_data.precision,
                            cs_id_uuid,
                            all_data.code AS mnv_code,
                            all_data.code_unit,
                            SUM(valuesum) AS sum_value,
                            AVG(valuesum) AS avg_value,
                            MAX(valuesum) AS max_value
                        FROM
                            all_data
                            JOIN companies_structure cs ON cs.id_uuid = cs_id_uuid
                        WHERE
                            (valuesum IS NOT NULL OR all_data.code LIKE 'E')
                        GROUP BY
                            cs_id_uuid,
                            all_data.code,
                            all_data.precision,
                            all_data.code_unit
                        ORDER BY
                            cs_id_uuid
                    ) a
                    JOIN companies_structure cs ON cs.id_uuid = a.cs_id_uuid
                ) b
                WHERE
                    cnt_du != 0;
            `,
            [start_time, end_time, start_age, end_age, sex, dose_types, struct]
        )

        return { firstData, secondData }
    }

    async getCDGraphics(
        on_business_trips,
        by_surveys,
        by_receipts,
        main_tdk,
        additional_tdk,
        odk,
        date_start,
        date_end,
        struct,
        age_from,
        age_to,
        sex_man,
        sex_woman,
        all_child_structures,
        chief_orb,
        chief_lprk_orb
    ) {
        const filteredArray = dataCollectiveDoses.filterObjectsByDate(
            dataCollectiveDoses.generedTestData,
            new Date(date_start),
            new Date(date_end)
        )

        const withDosesArray = dataCollectiveDoses.sumDoses(filteredArray)

        const withColorsArray = dataCollectiveDoses.mergeColors(
            withDosesArray,
            dataCollectiveDoses.colorArray
        )

        const doughnutChartData =
            dataCollectiveDoses.createChartData(withColorsArray)

        let sex = null

        if (sex_man && sex_woman) {
            sex = null
        } else if (sex_man) {
            sex = 'm'
        } else if (sex_woman) {
            sex = 'f'
        }

        const personal = await db.query(
            `
                SELECT DISTINCT
                    p.id_uuid,
                    p.surname,
                    p.name,
                    p.patronymic,
                    CASE WHEN p.sex::VARCHAR = 'f' THEN 'Жен.' ELSE 'Муж.' END as sex,
                    p.birthday,
                    pph.photo,
                    pp."name" as name_post,
                    pp.code as code_post,
                    pc.personnel_number,
                    pc.pass_sfz,
                    CASE WHEN MAX(tda.set_datetime) is not null THEN 'Да' ELSE 'Нет' END as on_tda
                FROM
                    personal p
                    LEFT JOIN personal_photo pph ON pph.personal_id_uuid = p.id_uuid
                    LEFT JOIN personal_career pc ON pc.personal_id_uuid = p.id_uuid
                    LEFT JOIN tdk_dose_account tda ON tda.career_id_uuid = pc.id_uuid
                    LEFT JOIN personal_idcards pi ON pi.personal_id_uuid = p.id_uuid
                    LEFT JOIN personal_posts pp on pc.post_id_uuid = pp.id_uuid
                WHERE
                    CASE
                        WHEN $1::uuid is null THEN true
                        ELSE cs_in_parent_cs(pc.company_structure_id_uuid, $1)
                    END
                    and case when $2::varchar is null then true else p.sex = $2 end
                    AND CASE
                        WHEN $3::int is null OR $4::int is null THEN true
                        ELSE DATE_PART('year', age(current_date, p.birthday)) BETWEEN $3 AND $4
                    END
                GROUP BY p.id_uuid, p.surname, p.name, p.patronymic, sex, p.birthday, pph.photo, pp."name", pp.code, pc.personnel_number, pc.pass_sfz
                `,
            [struct, sex, +age_from, +age_to]
        )

        let horizontalBarArrayLabels = []
        let personalDoses = []

        if (personal.rows.length > 0) {
            personal.rows.forEach((elem) => {
                horizontalBarArrayLabels.push(
                    `${elem.surname} ${elem.name[0]}.${elem.patronymic[0]}.`
                )

                const data = dataGraphics.barIDCData.find(
                    (p) => p.id_uuid === elem.id_uuid
                ).info.datasets[0].data
                const lastElement = data[data.length - 1]
                personalDoses.push(lastElement)
            })
        }

        const barChartData = {
            labels: horizontalBarArrayLabels,
            datasets: [
                {
                    label: 'Суммарная доза',
                    data: personalDoses,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    barThickness: 15,
                },
            ],
        }

        return { doughnut: doughnutChartData, bar: barChartData }
    }

    async getIDGraphics(
        on_business_trips,
        by_surveys,
        by_receipts,
        main_tdk,
        additional_tdk,
        odk,
        date_start,
        date_end,
        struct,
        age_from,
        age_to,
        sex_man,
        sex_woman,
        all_child_structures,
        chief_orb,
        chief_group_idc
    ) {
        const filteredArray = dataCollectiveDoses.filterObjectsByDate(
            dataCollectiveDoses.generedTestData,
            new Date(date_start),
            new Date(date_end)
        )

        const withDosesArray = dataCollectiveDoses.sumDoses(filteredArray)

        const withColorsArray = dataCollectiveDoses.mergeColors(
            withDosesArray,
            dataCollectiveDoses.colorArray
        )

        const doughnutChartData =
            dataCollectiveDoses.createChartData(withColorsArray)

        let sex = null

        if (sex_man && sex_woman) {
            sex = null
        } else if (sex_man) {
            sex = 'm'
        } else if (sex_woman) {
            sex = 'f'
        }

        const personal = await db.query(
            `
                SELECT DISTINCT
                    p.id_uuid,
                    p.surname,
                    p.name,
                    p.patronymic,
                    CASE WHEN p.sex::VARCHAR = 'f' THEN 'Жен.' ELSE 'Муж.' END as sex,
                    p.birthday,
                    pph.photo,
                    pp."name" as name_post,
                    pp.code as code_post,
                    pc.personnel_number,
                    pc.pass_sfz,
                    CASE WHEN MAX(tda.set_datetime) is not null THEN 'Да' ELSE 'Нет' END as on_tda
                FROM
                    personal p
                    LEFT JOIN personal_photo pph ON pph.personal_id_uuid = p.id_uuid
                    LEFT JOIN personal_career pc ON pc.personal_id_uuid = p.id_uuid
                    LEFT JOIN tdk_dose_account tda ON tda.career_id_uuid = pc.id_uuid
                    LEFT JOIN personal_idcards pi ON pi.personal_id_uuid = p.id_uuid
                    LEFT JOIN personal_posts pp on pc.post_id_uuid = pp.id_uuid
                WHERE
                    CASE
                        WHEN $1::uuid is null THEN true
                        ELSE cs_in_parent_cs(pc.company_structure_id_uuid, $1)
                    END
                    and case when $2::varchar is null then true else p.sex = $2 end
                    AND CASE
                        WHEN $3::int is null OR $4::int is null THEN true
                        ELSE DATE_PART('year', age(current_date, p.birthday)) BETWEEN $3 AND $4
                    END
                GROUP BY p.id_uuid, p.surname, p.name, p.patronymic, sex, p.birthday, pph.photo, pp."name", pp.code, pc.personnel_number, pc.pass_sfz
                `,
            [struct, sex, +age_from, +age_to]
        )

        let horizontalBarArrayLabels = []
        let personalDoses = []

        if (personal.rows.length > 0) {
            personal.rows.forEach((elem) => {
                horizontalBarArrayLabels.push(
                    `${elem.surname} ${elem.name[0]}.${elem.patronymic[0]}.`
                )

                const data = dataGraphics.barIDCData.find(
                    (p) => p.id_uuid === elem.id_uuid
                ).info.datasets[0].data
                const lastElement = data[data.length - 1]
                personalDoses.push(lastElement)
            })
        }

        const barChartData = {
            labels: horizontalBarArrayLabels,
            datasets: [
                {
                    label: 'Суммарная доза',
                    data: personalDoses,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    barThickness: 15,
                },
            ],
        }

        return { doughnut: doughnutChartData, bar: barChartData }
    }
}

module.exports = new ReportsService()
