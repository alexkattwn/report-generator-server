const companyStructureService = require('../services/company-structure.service')

class CompanyStructureController {
    async getCompanyStructure(req, res, next) {
        try {
            const { value } = req.query

            const companyStructure =
                await companyStructureService.getCompanyStructure(value)

            return res.status(200).json(companyStructure)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new CompanyStructureController()
