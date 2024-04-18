require('dotenv').config()

const cors = require('cors')
const express = require('express')
const path = require('path')

const router = require('./routes')
const errorMiddlware = require('./middlewares/error.middleware')

const PORT = process.env.PORT || 5000

const app = express()

app.set('view engine', 'hbs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(express.json())
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
)

app.use('/api', router)

app.use(errorMiddlware)

app.listen(PORT, () =>
    console.log(
        `[server]: Server is running at http://localhost:${PORT}/api 🚀 🗿🗿🗿`
    )
)
