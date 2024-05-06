# Report Generator Server

Web-модуль генерации отчетов для платформы индивидуального дозиметрического контроля NuclearIDM

## API Documentation

Сервер разработан на Express.js

## Аутентификация

#### - POST request

http://localhost:5000/api/auth/sign-in

Описание: Отправляет запрос на аутентификацию пользователя

Тело запроса:

    {
        "login": "12345",
        "identifier": "12345"
    }

Пример ожидаемого ответа :

    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhiODA1ZGZiLTg3OTctNGFhMS1iOTgzLWY3NDc1ZmE3ZGVlYyIsInJvbGUiOiLQkNC00LzQuNC90LjRgdGC0YDQsNGC0L7RgCIsImlhdCI6MTcxNTAxNzA3OSwiZXhwIjoxNzE1MTg5ODc5fQ.ULhqf87EDiMJ_qUuHP7QT1Iw6QAnOBIL1r-Mr-Kd7lg",
        "id": "8b805dfb-8797-4aa1-b983-f7475fa7deec",
        "showname": "Администратор"
    }

## Регистрация

#### - POST request

http://localhost:5000/api/auth/sign-up

Описание: Отправляет запрос на регистрацию нового пользователя

Тело запроса:

    {
        "login": "test",
        "showname": "test",
        "identifier": "test",
        "code": "test"
    }

Пример ожидаемого ответа: "Регистрация прошла успешно"

# Точки доступа для авторизованных пользователей

В заголовок запроса authorization нужно добавит Bearer-токен

## Валидация токена доступа

#### - GET request

http://localhost:5000/api/auth/check-token

Описание: валидирует токен доступа

Пример ожидаемого ответа, при валидном токене:

    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhiODA1ZGZiLTg3OTctNGFhMS1iOTgzLWY3NDc1ZmE3ZGVlYyIsInJvbGUiOiLQkNC00LzQuNC90LjRgdGC0YDQsNGC0L7RgCIsImlhdCI6MTcxNTAxNzM3NCwiZXhwIjoxNzE1MTkwMTc0fQ.84Z7ZfKWTFXY2Kav8lyBDR6mxWo1T2i0o7jyg7uXS48",
        "id": "8b805dfb-8797-4aa1-b983-f7475fa7deec",
        "showname": "Администратор"
    }

## Структуры компании

#### - GET request

http://localhost:5000/api/company-structure

Описание: Получение списка структур

Параметр URL (опционально):

    value=[string]

Пример ожидаемого ответа:

    [
        {
            "id_uuid": "d32aaa80-c53c-4fec-a0ed-e06df65c490e",
            "parent_id_uuid": null,
            "name": "Комплекс по переработке твердых радиоактивных отходов Курской АЭС",
            "shortname": "КП ТРО",
            "code": "КП ТРО"
        },
    ]

## Должности

#### - GET request

http://localhost:5000/api/posts

Описание: Получение списка должностей

Параметр URL (опционально):

    value=[string]

Пример ожидаемого ответа:

    [
        {
            "id_uuid": "33ba333a-a03d-4769-b135-ff0d10f12dc3",
            "code": "Арматурщик",
            "name": "Арматурщик",
            "create_date": "2020-10-14T12:58:44.873Z",
            "update_date": null
        },
    ]

## Персонал

#### - GET request

http://localhost:5000/api/personal

Описание: Получение списка сотрудников

Параметр URL (опционально):

    fio=[string]

Получаем список сотрудников:

    [
        {
            "struct": "null",
            "post": "null",
            "pass_sfz": "null",
            "personal_number": "null",
            "doc_number": "null",
            "contacts": "null",
            "page": "1",
        },
    ]

## Фильтры

#### - GET request

http://localhost:5000/api/filters

Описание: Получение списка сохраненных фильтров для генерации отчета

Параметр URL (обязательно):

    name_report=[string]

Пример ожидаемого ответа:

    [
        {
            "id_report": "19fb2981-13c6-4d0d-bd84-fa0edfbbfc06",
            "name_report": "Соблюдение КУ",
            "name_filter": "Фуцын",
            "parameters": "{\"struct\":null,\"actual\":\"t\",\"cl_es\":\"f\",\"end_age\":100,\"mv_id\":null,\"sex\":null,\"tda_id\":null,\"selectedObject\":null,\"personal\":null,\"post\":null,\"start_age\":0,\"dt_start\":1634119619038}",
            "id_filter": "0406bf24-a713-4d8c-9697-6700b68fff1e"
        }
    ]

#### - POST request

http://localhost:5000/api/filters

Описание: Сохранение нового фильтра

Тело запроса:

    {
        "name_report": "Соблюдение КУ",
        "name": "Фуцын",
        "parameters": "{\"struct\":null,\"actual\":\"t\",\"cl_es\":\"f\",\"end_age\":100,\"mv_id\":null,\"sex\":null,\"tda_id\":null,\"selectedObject\":null,\"personal\":null,\"post\":null,\"start_age\":0,\"dt_start\":1634119619038}"
    }

Пример ожидаемого ответа:

    {
        "id_report": "19fb2981-13c6-4d0d-bd84-fa0edfbbfc06",
        "name_report": "Соблюдение КУ",
        "name_filter": "Фуцын",
        "parameters": "{\"struct\":null,\"actual\":\"t\",\"cl_es\":\"f\",\"end_age\":100,\"mv_id\":null,\"sex\":null,\"tda_id\":null,\"selectedObject\":null,\"personal\":null,\"post\":null,\"start_age\":0,\"dt_start\":1634119619038}",
        "id_filter": "0406bf24-a713-4d8c-9697-6700b68fff1e"
    }

#### DELETE request

http://localhost:5000/api/filters

Описание: Удаление фильтра

Параметр URL (обязательно):

    id_filter=[string]
    name_report=[string]

Пример ожидаемого ответа:

    [
        {
            "id_report": "19fb2981-13c6-4d0d-bd84-fa0edfbbfc06",
            "name_report": "Соблюдение КУ",
            "name_filter": "Фуцын",
            "parameters": "{\"struct\":null,\"actual\":\"t\",\"cl_es\":\"f\",\"end_age\":100,\"mv_id\":null,\"sex\":null,\"tda_id\":null,\"selectedObject\":null,\"personal\":null,\"post\":null,\"start_age\":0,\"dt_start\":1634119619038}",
            "id_filter": "0406bf24-a713-4d8c-9697-6700b68fff1e"
        },
    ]

## Руководство пользователя

http://localhost:5000/api/users-guide

Описание: Получение пошагового руководства пользователя для генерации отчета

#### - GET request

Параметр URL (обязательно):

    report_id=[string]

Пример ожидаемого ответа :

    {
        "id_uuid": "93e2fa64-c1dc-4bd5-b027-8319f8653435",
        "title": "Выбор отчета",
        "description": "Описание изображения",
        "image_light": "picture_light.png",
        "image_dark": "picture_dark.png",
        "sequence_number": 1,
        "report_id_uuid": "5ed757ec-cd92-4e59-9450-03086500178f"
    }
