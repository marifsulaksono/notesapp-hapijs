const InvariantError = require('../../exceptions/InvariantError')
const { NoteSchema } = require('./schema')

const NoteValidator = {
    validateNotePayload: (payload) => {
        const validationResult = NoteSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = NoteValidator