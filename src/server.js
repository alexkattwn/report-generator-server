require('dotenv').config()

const cors = require('cors')
const express = require('express')
const fileUpload = require('express-fileupload')

const router = require('./routes')
const errorMiddlware = require('./middlewares/error.middleware')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(fileUpload({}))
app.use(
    cors({
        credentials: true,
        origin: [process.env.CLIENT_URL_DEV, process.env.CLIENT_URL_PROD],
    })
)

app.use('/api', router)

app.use(errorMiddlware)

app.listen(PORT, () =>
    console.log(
        `[server]: Server is running at http://localhost:${PORT}/api 🚀 🗿🗿🗿`
    )
)

module.exports = app
