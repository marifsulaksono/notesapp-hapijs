require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

const notes = require('./api/notes')
const NotesService = require('./service/postgres/noteService')
const NotesValidator = require('./validator/notes')

const users = require('./api/users')
const UserService = require('./service/postgres/userService')
const UserValidator = require('./validator/users')

const authentications = require('./api/authentications')
const AuthenticationService = require('./service/postgres/authenticationService')
const AuthenticationValidator = require('./validator/authentication')
const TokenManager = require('./tokenize/tokenManager')

const init = async () => {
  const notesService = new NotesService()
  const userService = new UserService()
  const authenticationService = new AuthenticationService()
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
      plugin: Jwt
    }
  ])

  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
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
    },
    {
      plugin: authentications,
      options: {
        authenticationService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator
      }
    }
  ])

  await server.start()
  console.log(`server running at ${server.info.uri}`)
}

init()
