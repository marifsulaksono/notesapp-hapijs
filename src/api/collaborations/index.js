const CollaborationHandler = require('./handler')
const routes = require("./routes")

module.exports = {
    name: 'collaborations',
    version: '1.0.0',
    register: async (server, { collaborationService, noteService, validator }) => {
        const collaborationHandler = new CollaborationHandler(
            collaborationService,
            noteService,
            validator,
        )

        server.route(routes(collaborationHandler))
    }
}