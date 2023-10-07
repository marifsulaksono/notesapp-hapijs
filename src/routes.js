const { addNoteHandler, getAllNotes, getNotesById, editNoteById, deleteNoteById } = require('./handler')

const routes = [
  {
    method: 'GET',
    path: '/notes',
    handler: getAllNotes
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: getNotesById
  },
  {
    method: 'POST',
    path: '/notes',
    handler: addNoteHandler
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: editNoteById
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: deleteNoteById
  }
]

module.exports = routes
