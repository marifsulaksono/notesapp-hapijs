const Joi = require('joi')

const UsersSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
})

module.exports = { UsersSchema }