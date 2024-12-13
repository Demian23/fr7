import moviesRoutes from './routes/movies.routes'
import userRoutes from './routes/user.routes'
import errorHandler from './errors/handler'
import api from './routes/api.instance'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import Chat from './controllers/chat.controller'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use(api.movies(), moviesRoutes)
app.use(api.user(), userRoutes)
app.use(errorHandler)
const serv = createServer(app)
const chat = new Chat(serv)
chat.start()

serv.listen(PORT, () => {
    console.log(`APP is running on http://localhost:${PORT}${api.movies()}`)
})
