const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthenticationError = require('../../exceptions/AuthenticationError')
const bcrypt = require('bcrypt')

class UserService {
    constructor() {
        this._pool = new Pool()
    }

    async addUser({ username, password, fullname }) {
        // await this.verifyNewUsername(username)
        const existUsername = await this._pool.query('SELECT  username FROM users WHERE username = $1', [username])
        if (existUsername.rows.length > 0) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.')
        }

        const id = `user-${nanoid(16)}`
        const hashedPassword = await bcrypt.hash(password, 10)
        const query = {
            text: 'INSERT INTO users VALUES ($1,$2,$3,$4) RETURNING id',
            values: [id, username, hashedPassword, fullname],
        }

        const result = await this._pool.query(query)
        if (!result.rows[0].id) {
            throw new InvariantError('User gagal ditambahkan')
        }

        return result.rows[0].id
    }

    async getUserById(userId) {
        const result = await this._pool.query('SELECT id, username, fullname FROM users WHERE id = $1', [userId])
        if (!result.rowCount) {
            throw new NotFoundError('User tidak ditemukan')
        }

        return result.rows[0]
    }

    async getUsersByUsername(username) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
            values: [`%${username}%`],
        }

        const result = await this._pool.query(query)
        return result.rows
    }

    async verifyNewUsername(username) {
        const result = await this._pool.query('SELECT  username FROM users WHERE username = $1', [username])
        if (result.rows.length > 0) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.')
        }
    }

    async verifyUserCredential(username, password) {
        const result = await this._pool.query('SELECT id, password FROM users WHERE username = $1', [username])
        if (!result.rows.length) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah')
        }

        const { id, password: hashedPassword } = result.rows[0]
        const matchPassword = await bcrypt.compare(password, hashedPassword)
        if (!matchPassword) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah')
        }

        return id
    }
}

module.exports = UserService