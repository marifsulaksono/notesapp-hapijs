const { nanoid } = require('nanoid')

class NotesService {
    constructor() {
        this._notes = []
    }

    addNote({ title, body, tags }) {
        const id = nanoid(16)
        const createdAt = new Date().toString()
        const updatedAt = createdAt

        const newNote = {
            id, title, tags, body, createdAt, updatedAt
        }

        this._notes.push(newNote)

        const isSuccess = this._notes.filter((note) => note.id === id).length > 0
        if (!isSuccess) {
            throw new Error('Gagal menambahkan catatan')
        }

        return id
    }

    getAllNotes() {
        return this._notes
    }

    getNoteById(id) {
        const note = this._notes.filter((note) => note.id === id)[0]
        if (!note) {
            throw new Error('Catatan tidak ditemukan')
        }

        return note
    }

    editNoteById(id, { title, body, tags }) {
        const index = this._notes.findIndex((note) => note.id === id)
        if (index === -1) {
            throw new Error('Gagal memperbarui catatan. Id tidak ditemukan')
        }

        const updatedAt = new Date().toString()
        this._notes[index] = {
            ...this._notes[index],
            title,
            tags,
            body,
            updatedAt
        }
    }

    deleteNoteById(id) {
        const index = this._notes.findIndex((note) => note.id === id)
        if (index === -1) {
            throw new Error('Gagal menghapus catatan. Id tidak ditemukan')
        }

        this._notes.splice(index, 1)
    }
}

module.exports = NotesService