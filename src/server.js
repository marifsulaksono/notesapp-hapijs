require('dotenv').config()

const Hapi = require('@hapi/hapi')
const notes = require('./api/notes')
const NotesService = require('./service/postgres/noteService')
const NotesValidator = require('./validator/notes')

const users = require('./api/users')
const UserService = require('./service/postgres/userService')
const UserValidator = require('./validator/users')

const init = async () => {
  const notesService = new NotesService()
  const userService = new UserService()
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator
      }
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: UserValidator
      }
    }
  ])

  await server.start()
  console.log(`server running at ${server.info.uri}`)
}

init()
