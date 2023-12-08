const routes = (handler) => [
  {
    method: 'GET',
    path: '/notes',
    handler: handler.getAllNotesHandler
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: handler.getNoteByIdHandler
  },
  {
    method: 'POST',
    path: '/notes',
    handler: handler.postNoteHandler
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: handler.putNoteByIdHandler
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: handler.deleteNoteByIdHandler
  }
]

module.exports = routes
