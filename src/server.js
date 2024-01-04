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

const collaborations = require('./api/collaborations')
const CollaborationService = require('./service/postgres/collaborationService')
const CollaborationValidator = require('./validator/collaboration')

const _exports = require('./api/exports')
const ProducerService = require('./service/rabbitmq/producerService')
const ExportsValidator = require('./validator/exports')

const TokenManager = require('./tokenize/tokenManager')
const ClientError = require('./exceptions/ClientError')

const init = async () => {
  const collaborationService = new CollaborationService()
  const notesService = new NotesService(collaborationService)
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
    },
    {
      plugin: collaborations,
      options: {
        collaborationService,
        noteService: notesService,
        validator: CollaborationValidator
      }
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator
      }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })

        newResponse.code(response.statusCode)
        return newResponse
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })

      newResponse.code(500)
      console.log(response.message)
      return newResponse
    }

    return h.continue
  })

  await server.start()
  console.log(`server running at ${server.info.uri}`)
}

init()
