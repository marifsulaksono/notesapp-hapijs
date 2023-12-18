const InvariantError = require('../../exceptions/InvariantError')
const { UsersSchema } = require('./schema')

const UserValidator = {
    validateUserPayload: (payload) => {
        const validationResult = UsersSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = UserValidator