const db = require('../db')

class CompanyStructureService {
    async getCompanyStructure(value) {
        let companyStructure
        if (!value) {
            companyStructure = await db.query(
                'SELECT * FROM companies_structure'
            )
        } else {
            companyStructure = await db.query(
                `SELECT * FROM companies_structure WHERE LOWER(name) LIKE '%' || LOWER($1) || '%'`,
                [value]
            )
        }

        return companyStructure.rows
    }
}

module.exports = new CompanyStructureService()
