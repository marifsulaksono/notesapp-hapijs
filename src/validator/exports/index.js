const ExportsSchemaPayload = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const ExportsValidator = {
    validateExportsPayload: (payload) => {
        const validationResult = ExportsSchemaPayload.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = ExportsValidator