const filtersService = require('../services/filters.service')

class FiltersController {
    async getFilters(req, res, next) {
        try {
            const { name_report, value } = req.query
            const filters = await filtersService.getFilters(name_report, value)
            return res.status(200).json(filters)
        } catch (e) {
            next(e)
        }
    }

    async createFilter(req, res, next) {
        try {
            const { name_report, name, parameters } = req.body
            const filters = await filtersService.createFilter(
                name_report,
                name,
                parameters
            )
            return res.status(200).json(filters)
        } catch (e) {
            next(e)
        }
    }

    async removeFilter(req, res, next) {
        try {
            const { id_filter, name_report } = req.query
            const filters = await filtersService.removeFilter(
                id_filter,
                name_report
            )
            return res.status(200).json(filters)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new FiltersController()
