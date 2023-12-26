const routes = (handler) => [
    {
        method: 'GET',
        path: '/users/{id}',
        handler: handler.getUserByIdHandler
    },
    {
        method: 'GET',
        path: '/users',
        handler: handler.getUsersByUsernameHandler
    },
    {
        method: 'POST',
        path: '/users',
        handler: handler.postUserHandler
    }
]

module.exports = routes