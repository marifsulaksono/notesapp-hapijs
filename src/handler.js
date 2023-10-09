const { nanoid } = require('nanoid')
const { notes, addNote } = require('./notes')

const getAllNotes = (request, h) => {
  const response = h.response({
    status: 'success',
    data: {
      notes
    }
  })

  return response
}

const getNotesById = (request, h) => {
  const { id } = request.params

  const note = notes.filter((n) => n.id === id)[0]

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note
      }
    }
  }

  const response = h.response({
    status: 'failed',
    message: 'Catatan tidak ditemukan'
  })

  response.code(404)
  return response
}

const addNoteHandler = (request, h) => {
  const id = nanoid(16)
  const { title, tags, body } = request.payload

  const createdAt = new Date().toString()
  const updatedAt = createdAt

  const newNote = {
    id, title, tags, body, createdAt, updatedAt
  }

  addNote(newNote)
  const isSuccess = notes.filter((notes) => notes.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'failed',
    message: 'Catatan gagal ditambahkan'
  })
  response.code(500)
  return response
}

const editNoteById = (request, h) => {
  const { id } = request.params
  const { title, tags, body } = request.payload
  const updatedAt = new Date().toString()

  const index = notes.findIndex((note) => note.id === id)

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'failed',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan!'
  })

  response.code(404)
  return response
}

const deleteNoteById = (request, h) => {
  const { id } = request.params
  const index = notes.findIndex((note) => note.id === id)

  if (index !== -1) {
    notes.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus!'
    })

    response.code(200)
    return response
  }

  const response = h.response({
    status: 'failed',
    message: 'Gagal menghapus catatan. Id tidak ditemukan!'
  })

  response.code(404)
  return response
}

module.exports = { addNoteHandler, getAllNotes, getNotesById, editNoteById, deleteNoteById }
