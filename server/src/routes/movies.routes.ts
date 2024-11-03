import { Router } from 'express'
import { MoviesController } from '../controllers/movies.controller'

const router = Router()
const controller = new MoviesController()

router.get('/', controller.getMovies)

export default router
