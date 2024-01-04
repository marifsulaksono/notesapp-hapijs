const Joi = require('joi')

const ExportsSchemaPayload = Joi.object({
    targetEmail: Joi.string().email({ tlds: true }).required()
})

module.exports = ExportsSchemaPayload