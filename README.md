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

#### - GET request

http://localhost:5000/api/users-guide

Описание: Получение пошагового руководства пользователя для генерации отчета

Параметр URL (обязательно):

    report_id=[string]

Пример ожидаемого ответа:

    [
        {
            "id_uuid": "93e2fa64-c1dc-4bd5-b027-8319f8653435",
            "title": "Выбор отчета",
            "description": "Описание изображения",
            "image_light": "picture_light.png",
            "image_dark": "picture_dark.png",
            "sequence_number": 1,
            "report_id_uuid": "5ed757ec-cd92-4e59-9450-03086500178f"
        }
    ]

#### - POST request

http://localhost:5000/api/users-guide

Описание: Создание нового элемента руководства

Тело запроса:

    {
        "title": "Выбор отчета",
        "description": "Описание изображения",
        "sequence_number": 1,
        "image_light": "picture_light.png",
        "image_dark": "picture_dark.png",
        "report_id_uuid": "5ed757ec-cd92-4e59-9450-03086500178f"
    }

Пример ожидаемого ответа:

    {
        "id_uuid": "93e2fa64-c1dc-4bd5-b027-8319f8653435",
        "title": "Выбор отчета",
        "description": "Описание изображения",
        "image_light": "picture_light.png",
        "image_dark": "picture_dark.png",
        "sequence_number": 1,
        "report_id_uuid": "5ed757ec-cd92-4e59-9450-03086500178f"
    }

## Отчеты

#### - GET request

http://localhost:5000/api/reports/individual-dose-card

Описание: Получение карты индивидуальных доз

Параметр URL (обязательно):

    id_personal=[string]

Пример ожидаемого ответа:

    {
        "personInfo": {
            "id_uuid": "a48cbbb3-32c6-4aaa-a428-598be79f27ad",
            "surname": "Иванов",
            "name": "Иван",
            "patronymic": "Иванович",
            "sex": "Муж.",
            "birthday": "1998-11-11T19:00:00.000Z",
            "photo": null,
            "on_tda": "Да"
        },
        "document": {
            "doc": ", , , "
        },
        "iRDAccident": {
            "start_datetime": null,
            "end_datetime": null,
            "place": "-",
            "mv_name": "Код НВ",
            "value": null,
            "mnv_precision": null
        },
        "iRDBeforeWork": {
            "start_datetime": null,
            "end_datetime": null,
            "place": "-",
            "mv_name": "Код НВ",
            "value": null,
            "mnv_precision": null,
            "uncertainty": null
        },
        "listPeriods": {
            "number": 1,
            "year": "2023",
            "label": "1 квартал",
            "mv_value": "E, мЗв",
            "value": null,
            "mnv_precision": 3
        },
        "iRDBusinessTrips": {
            "start_datetime": null,
            "end_datetime": null,
            "place": "-",
            "mv_name": "Код НВ",
            "work": "-",
            "value": null,
            "mnv_precision": null,
            "uncertainty": null
        },
        "dosimetricRegistration": {
            "set_datetime": "2024-01-11T09:14:39.447Z",
            "dismiss_datetime": null,
            "struct": "КП ТРО",
            "name": "Инженер-конструктор 2 категории"
        },
        "iRDMainPlaceWork": {
            "start_datetime": "2024-03-05T11:08:39.327Z",
            "end_datetime": "2024-03-14T07:50:56.000Z",
            "additional": " ",
            "model_name": "standard",
            "mv_name": "E, мЗв",
            "value": "1.0",
            "uncertainty": "0.0",
            "mnv_precision": 3
        },
        "littleObj": {
            "mv_name": "E, [мЗв]",
            "t": "-",
            "name": "эффективная доза"
        },
        "info": {
            "model_code": "standard",
            "t": "-",
            "name": "постоянный ТДК для всего персонала"
        },
        "headerInfo": {
            "id_uuid": "a48cbbb3-32c6-4aaa-a428-598be79f27ad",
            "fio": "Иванов Иван Иванович",
            "birthday": "12.11.1998",
            "contacts": "",
            "min_datetime": "11.01.2024",
            "max_datetime": null,
            "e_sertificate": "ЦРБ аккредитован на соответствие ГОСТ ISO/IEC 17025-2019 (аттестат аккредитации от 22.01.2021 № BY/112 2.5262)"
        }
    }

#### - GET request

http://localhost:5000/api/reports/idc-graphics

Описание: Получение данных для графиков

Параметр URL (обязательно):

    id_personal=[string]

Пример ожидаемого ответа:

    {
        "area": {
            "id_uuid": "a48cbbb3-32c6-4aaa-a428-598be79f27ad",
            "info": {
            "labels": [
                "апрель",
                "март",
                "февраль",
                "январь",
                "декабрь",
                "ноябрь",
                "октябрь",
                "сентябрь",
                "август",
                "июль",
                "июнь",
                "май"
            ],
            "datasets": [
                    {
                        "fill": true,
                        "label": "Доза",
                        "data": [
                            0.0002697356460234585,
                            0,
                            0.00018325743773351028,
                            0.0002179715957053377,
                            0.000028637087678528965,
                            0.0003390562664580852,
                            0.00031846014997821204,
                            0.00012535769469685084,
                            0,
                            0.0002997653561673069,
                            0.0003522925006543878,
                            0.0003382232544554231
                        ],
                        "borderColor": "rgb(53, 162, 235)",
                        "backgroundColor": "rgba(53, 162, 235, 0.5)"
                    }
                ]
            }
        },
        "bar": {
            "id_uuid": "a48cbbb3-32c6-4aaa-a428-598be79f27ad",
            "info": {
            "labels": [
                2020,
                2021,
                2022,
                2023,
                2024
            ],
            "datasets": [
                    {
                        "label": "Доза",
                        "data": [
                            0.0008241280659297684,
                            0.00045149195909693543,
                            0.0007976373391693635,
                            0.0004321113365258625,
                            0.00004625566703503
                        ],
                        "backgroundColor": "rgba(255, 99, 132, 0.5)"
                    }
                ]
            }
        },
        "pie": {
            "id_uuid": "a48cbbb3-32c6-4aaa-a428-598be79f27ad",
            "info": {
            "labels": [
                "эффективная доза",
                "экспозиционная доза",
                "поступление радионуклида",
                "эквивалентная доза на поверхности нижней части области живота",
                "эквивалентная доза в хрусталике глаза",
                "эквивалентная доза в кистях и стопах",
                "эквивалентная доза в коже"
            ],
            "datasets": [
                    {
                        "label": "Доза",
                        "data": [
                            0,
                            0.00019135901342413428,
                            0,
                            0.00010154657413581343,
                            0.00010643324826032315,
                            0.00006133015819593442,
                            0.0001770150218306447
                        ],
                        "backgroundColor": [
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(179, 177, 175, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(255, 159, 64, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(166, 245, 236, 0.6)"
                        ],
                        "borderColor": [
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(179, 177, 175, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(255, 159, 64, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(166, 245, 236, 0.6)"
                        ],
                        "borderWidth": 1
                    }
                ]
            }
        }
    }

#### - GET request

http://localhost:5000/api/reports/cd-graphics

Описание: Получение данных для графиков по коллективным дозам

Тело запроса:

    {
        "on_business_trips": null,
        "by_surveys": null,
        "by_receipts": null,
        "main_tdk": null,
        "additional_tdk": null,
        "odk": null,
        "date_start": "2024-02-01",
        "date_end": "2020-02-01",
        "struct": "d32aaa80-c53c-4fec-a0ed-e06df65c490e",
        "age_from": null,
        "age_to": null,
        "sex_man": null,
        "sex_woman": null,
        "all_child_structures": null,
        "chief_orb": null,
        "chief_lprk_orb": null
    }

Пример ожидаемого ответа:

    {
        "doughnut": {
            "labels": [],
            "datasets": [
                {
                    "label": "Суммарная доза",
                    "data": [],
                    "backgroundColor": [],
                    "borderColor": [],
                    "borderWidth": 1
                }
            ]
        },
        "bar": {
            "labels": [
                    "Иванов И.И."
                ],
            "datasets": [
                {
                    "label": "Суммарная доза",
                    "data": [
                        0.0008044468108284202
                    ],
                    "borderColor": "rgb(255, 99, 132)",
                    "backgroundColor": "rgba(255, 99, 132, 0.5)",
                    "barThickness": 15
                }
            ]
        }
    }
