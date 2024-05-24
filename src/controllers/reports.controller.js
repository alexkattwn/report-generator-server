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

    async getCDGraphics(req, res, next) {
        try {
            const {
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
                chief_lprk_orb,
            } = req.body

            const graphics = await reportsService.getCDGraphics(
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
            )

            return res.status(200).json(graphics)
        } catch (e) {
            next(e)
        }
    }

    async getIDGraphics(req, res, next) {
        try {
            const {
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
                chief_group_idc,
            } = req.body

            const graphics = await reportsService.getIDGraphics(
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
            )

            return res.status(200).json(graphics)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ReportsController()
