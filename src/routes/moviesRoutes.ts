import { Router } from 'express';
import { MoviesController } from '../controllers/moviesController.js'; 

const router = Router();
const controller = new MoviesController()

router.get('/', controller.getMovies);
router.get('/:id', controller.getMovieById);
router.post('/:id/rate', controller.setMovieMark);

export default router;
