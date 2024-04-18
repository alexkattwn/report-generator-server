module.exports = function calculateMonthlySum(data) {
    // Получаем текущую дату
    const today = new Date()
    // Получаем текущий год
    const currentYear = today.getFullYear()
    // Получаем дату 12 месяцев назад от текущей даты
    const twelveMonthsAgo = new Date(today.getFullYear() - 1, today.getMonth()) // Дата 12 месяцев назад

    // Создаем объект, который будет содержать суммарные значения для каждого уникального идентификатора за каждый месяц
    const monthlyData = {}

    // Проходимся по каждому элементу в массиве данных
    data.forEach((item) => {
        // Получаем идентификатор элемента
        const id_uuid = item.id_uuid
        // Получаем дату начала элемента
        const startDateTime = new Date(item.start_datetime)
        // Форматируем месяц и год начала в читаемый вид
        const monthYear = startDateTime.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
        })
        // Получаем числовое значение элемента
        const value = parseFloat(item.value)

        // Если для данного идентификатора еще не созданы данные в объекте monthlyData
        if (!monthlyData[id_uuid]) {
            monthlyData[id_uuid] = {
                id_uuid: id_uuid,
                months: [],
            }

            // Создаем записи за последний год для данного идентификатора
            for (let i = currentYear - 1; i <= currentYear; i++) {
                for (let j = 1; j <= 12; j++) {
                    // Форматируем месяц и год в читаемый вид
                    const monthName = new Date(i, j - 1).toLocaleString(
                        'default',
                        { month: 'long', year: 'numeric' }
                    )
                    // Проверяем, что месяц попадает в период за последний год
                    if (
                        new Date(i, j - 1) >= twelveMonthsAgo &&
                        new Date(i, j - 1) <= today
                    ) {
                        // Добавляем месяц с начальным значением 0 для данного идентификатора
                        monthlyData[id_uuid].months.push({
                            name: monthName,
                            value: 0,
                        })
                    }
                }
            }
        }

        // Находим индекс текущего месяца в массиве месяцев для данного идентификатора
        let monthIndex = monthlyData[id_uuid].months.findIndex(
            (entry) => entry.name === monthYear
        )

        // Если текущий месяц не найден, добавляем его с указанным значением
        if (monthIndex === -1) {
            monthlyData[id_uuid].months.push({
                name: monthYear,
                value: parseFloat(value).toFixed(10),
            })
        } else {
            // Если текущий месяц найден, добавляем значение к существующему значению
            monthlyData[id_uuid].months[monthIndex].value = parseFloat(
                parseFloat(monthlyData[id_uuid].months[monthIndex].value) +
                    parseFloat(value)
            ).toFixed(10)
        }
    })

    // Возвращаем массив значений объекта monthlyData
    return Object.values(monthlyData)
}
