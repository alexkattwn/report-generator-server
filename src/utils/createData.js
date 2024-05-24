const uuidList = [
    'a48cbbb3-32c6-4aaa-a428-598be79f27ad',
    '3e71b51f-e1bb-4eff-b4b5-c7459ed811fc',
    'a3a5c389-37db-49b7-a3de-fc02e5790676',
    'a5402bd0-cf60-40a1-8168-fdfa55fbbb8f',
    'f0053634-351d-44c0-bd7b-11259d51215c',
    '32832d52-4651-4cfd-8d08-4fccfba71065',
    'a9ea7efd-dc62-4936-b10a-6ab30afdc746',
    '9e795320-05ac-4b8d-87c9-ffb2a8553249',
    'e6959562-765b-46b8-adf4-ac73666b0e3b',
    '91c18930-90f6-440d-811d-a0cf607caae9',
    '29031718-626e-47c4-9841-738e8393cbea',
    '5ffab5db-3591-4def-ab08-ea9a3773989d',
    'ff9f3947-6ef6-4aec-b733-3bb16b400bf9',
    '4b5f855f-ca3e-4aaf-9461-6d89ebc0178a',
    '66af964d-0c1c-41fa-bc3f-78d90821f608',
    'f4c835d8-5d04-4cee-91c5-a0f3f4c2380f',
    'd13beb7b-8011-477a-83a7-80ae28682e32',
    '7e162c41-7c21-4511-9f71-01de24ae89a9',
    '2bf11d19-dcbd-4926-bbe7-614b2b9bdfcd',
    '686ac35f-28de-4919-83b3-7244a132cfab',
    'fff9f78a-1131-4898-9a30-61d226bea566',
    'ac2d4fb6-0709-43a0-a16c-3537cd4b5b56',
    'f1796132-5e2b-4ed4-99e3-5d8473ac8164',
    'a21e5ebb-846f-4842-a3a1-380440c1e19e',
    '2f02ec00-58dd-40b1-a74c-a4723dac4107',
    '87c8036c-275e-4488-a0d7-6adae9d6fdd1',
    '59468f00-12d1-4b0b-8057-5cd2b4baf38c',
    '89e3aabb-8ecc-45a8-a5c8-4e7f24004687',
    '1817c646-7e2b-4ddb-bf01-dc1e5fd9f98d',
    '2603a5e5-ac4f-4385-af2a-3cd7e7f083f1',
    'c6e5ccba-3413-49ec-9008-c53dd3d3f519',
    '1f679ae6-e8d4-464d-a5e1-488fdf8a6fb7',
    'f29fb133-dc95-4583-9edc-f9ec83dd501d',
    '81de7ce2-6cb8-4efb-a2c3-e4d77ec8f82a',
]

const createdAreaIDCData = uuidList.map((uuid) => {
    const data = []
    const zeroCount = Math.floor(Math.random() * 8) + 1 // Генерируем случайное количество нулей (от 1 до 8)
    for (let i = 0; i < 12; i++) {
        if (i < zeroCount) {
            data.push(0)
        } else {
            data.push(Math.random() * 0.000367)
        }
    }

    // Перемешиваем массив, чтобы нули были в случайном порядке
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[data[i], data[j]] = [data[j], data[i]]
    }

    data.reverse()

    return {
        id_uuid: uuid,
        info: {
            labels: monthsArray,
            datasets: [
                {
                    fill: true,
                    label: 'Доза',
                    data: data,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        },
    }
})

function generateRandomData() {
    const data = []

    for (let i = 0; i < 4; i++) {
        const randomValue = Math.random() * 0.000867
        data.push(randomValue)
    }

    const lastRandomValue = 0.000367 + Math.random() * (0.002367 - 0.000367)
    data.push(lastRandomValue)

    return data
}

const createBarIDCData = () =>
    uuidList.map((uuid) => {
        return {
            id_uuid: uuid,
            info: {
                labels: yearsArray,
                datasets: [
                    {
                        label: 'Доза',
                        data: generateRandomData(),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                ],
            },
        }
    })

function generateDataArrayForPie() {
    const dataArray = []
    const zeroCount = Math.floor(Math.random() * 5) // Случайное количество нолей от 0 до 4
    const nonZeroCount = 7 - zeroCount // Количество ненулевых элементов

    // Генерация ненулевых элементов
    for (let i = 0; i < nonZeroCount; i++) {
        dataArray.push(Math.random() * 0.0002) // Генерация случайного числа от 0 до 0.0002
    }

    // Добавление нулей в рандомные места
    for (let i = 0; i < zeroCount; i++) {
        const index = Math.floor(Math.random() * dataArray.length) // Случайный индекс
        dataArray.splice(index, 0, 0) // Вставка нуля в рандомное место
    }

    return dataArray
}

function generateObjectsForPie(uuidList) {
    const objects = []
    uuidList.forEach((uuid) => {
        const newObj = {
            id_uuid: uuid,
            info: {
                labels: normalizedValue,
                datasets: [
                    {
                        label: '# of Votes',
                        data: generateDataArrayForPie(), // Генерация массива данных
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 206, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(153, 102, 255)',
                            'rgb(255, 159, 64)',
                            'rgb(179, 177, 175)',
                            'rgb(166, 245, 236)',
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 206, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(153, 102, 255)',
                            'rgb(255, 159, 64)',
                            'rgb(179, 177, 175)',
                            'rgb(166, 245, 236)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
        }
        objects.push(newObj)
    })
    return objects
}
