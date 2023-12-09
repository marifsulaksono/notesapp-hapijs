const Joi = require('joi')

const NoteSchema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
})

module.exports = { NoteSchema }