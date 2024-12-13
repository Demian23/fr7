import { Router } from 'express'
import { MoviesController } from '../controllers/movies.controller'
import protection from '../controllers/protection.middleware'
import api from './api.instance'
const router = Router()
const controller = new MoviesController()

router.get('/', controller.getMovies)
router.get(api.byId(), protection, controller.getMovieDetailed)
router.get(api.person() + api.byId(), controller.getPersonDetails)
router.post(api.byId() + api.mark(), protection, controller.submitMovieMark)
router.delete(
    api.byId() + api.mark() + api.delete(),
    protection,
    controller.deleteMovieMark
)

export default router
