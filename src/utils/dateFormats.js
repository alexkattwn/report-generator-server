function formatDateAndTime(isoString) {
    const dateObject = new Date(isoString)

    if (isNaN(dateObject.getTime())) {
        return '-'
    }

    const year = dateObject.getUTCFullYear()
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0')
    const day = dateObject.getUTCDate().toString().padStart(2, '0')

    const hours = dateObject.getUTCHours().toString().padStart(2, '0')
    const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0')

    const formattedDateTime = `${day}.${month}.${year} ${hours}:${minutes}`

    return formattedDateTime
}

function reverseDate(dateString) {
    const [year, month, day] = dateString.split('-')
    return `${day}.${month}.${year}`
}

module.exports = {
    formatDateAndTime,
    reverseDate,
}
