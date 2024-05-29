const request = require('supertest')

const app = require('../src/server')

describe('Запуск сервера', () => {
    test('Проверка на успешный запуск сервера', async () => {
        const response = await request(app).get('/api/')
        expect(response.statusCode).toBe(200)
        expect(response.text).toBe('API запущено')
    })
})
