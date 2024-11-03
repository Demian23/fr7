import express from 'express'
import moviesRoutes from './routes/movies.routes'
import { Fr7Error } from './errors/errors'

const app = express()
const PORT = process.env.PORT
const API = process.env.API

app.use(express.urlencoded({ extended: true }))

app.use(`/${API}/movies`, moviesRoutes)

app.use((err: Error, _: express.Request, res: express.Response) => {
    let statusCode = 500
    let message = 'Internal server error'
    if (err instanceof Fr7Error) {
        statusCode = err.statusCode
        message = err.message
    } else {
        console.error(err)
    }
    res.render('error', { status: statusCode, message: message })
    return
})

app.listen(PORT, () => {
    console.log(`APP is running on http://localhost:${PORT}/${API}/movies`)
})
