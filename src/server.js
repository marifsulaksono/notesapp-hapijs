require('dotenv').config()

const Hapi = require('@hapi/hapi')
const notes = require('./api/notes')
const NotesService = require('./service/postgres/noteService')
const NotesValidator = require('./validator/notes')

const init = async () => {
  const notesService = new NotesService()
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    }
  })

  await server.start()
  console.log(`server running at ${server.info.uri}`)
}

init()
