const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../db')
const ApiError = require('../exceptions/api.error')

const salt = 8

const generateToken = (id, role) => {
    const payload = {
        id,
        role,
    }
    return jwt.sign(payload, `${process.env.SECRET_TOKEN}`, {
        expiresIn: '48h',
    })
}

class AuthService {
    async registration(login, showname, identifier, code) {
        const identifierType = await db.query(
            'select * from users_identifier_types where code = $1 limit 1',
            ['PASSWORD']
        )

        const newUser = await db.query(
            'insert into users (id_uuid, login, showname, active) values ($1, $2, $3, $4) RETURNING *',
            [uuidv4(), login, showname, true]
        )

        const userIndentifier = await db.query(
            'insert into users_identifiers (id_uuid, user_id_uuid, user_identifier_type_id_uuid, identifier, active, code) values ($1, $2, $3, $4, $5, $6) RETURNING *',
            [
                uuidv4(),
                newUser.rows[0].id_uuid,
                identifierType.rows[0].id_uuid,
                bcrypt.hashSync(identifier, salt),
                true,
                code,
            ]
        )

        const role = await db.query(
            'select * from users_roles where code = $1 limit 1',
            ['Администратор']
        )

        await db.query(
            'insert into users_role_user (id_uuid, role_id_uuid, user_id_uuid, users_identifiers_id_uuid) values ($1, $2, $3, $4) RETURNING *',
            [
                uuidv4(),
                role.rows[0].id_uuid,
                newUser.rows[0].id_uuid,
                userIndentifier.rows[0].id_uuid,
            ]
        )

        return 'Регистрация прошла успешно!'
    }

    async login(login, identifier) {
        const user = await db.query(
            'select id_uuid, showname from users where login = $1',
            [login]
        )

        if (!user.rows[0]) {
            throw ApiError.BadRequest('Неверный логин или пароль')
        }

        const hash = await db.query(
            'select identifier from users_identifiers where user_id_uuid = $1',
            [user.rows[0].id_uuid]
        )

        if (!hash.rows[0]) {
            throw ApiError.BadRequest('Неверный логин или пароль')
        }

        if (!bcrypt.compareSync(identifier, hash.rows[0].identifier)) {
            throw ApiError.BadRequest('Неверный логин или пароль')
        }

        const requiredRole = await db.query(
            'select * from users_roles where code = $1 limit 1',
            ['Администратор']
        )

        const role = await db.query(
            'select * from users_role_user where user_id_uuid = $1 and role_id_uuid = $2',
            [user.rows[0].id_uuid, requiredRole.rows[0].id_uuid]
        )

        if (!role.rows[0]) {
            throw ApiError.BadRequest('Доступ запрещен')
        }

        return {
            token: generateToken(
                user.rows[0].id_uuid,
                requiredRole.rows[0].code
            ),
            id: user.rows[0].id_uuid,
            showname: user.rows[0].showname,
        }
    }

    async checkToken(user) {
        const userFromDB = await db.query(
            'select id_uuid, showname from users where id_uuid = $1',
            [user.id]
        )

        return {
            token: generateToken(user.id, user.role),
            id: userFromDB.rows[0].id_uuid,
            showname: userFromDB.rows[0].showname,
        }
    }
}

module.exports = new AuthService()
