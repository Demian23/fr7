import express, { NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'
import moviesRoutes from './routes/moviesRoutes.js'; 
import { Fr7Error } from './errors/Fr7Errors.js';

const app = express();
const PORT = process.env.PORT;
const API = process.env.API
const dirname = path.dirname(fileURLToPath(import.meta.url)); 

app.set('view engine', 'ejs');
app.set('views', path.join(dirname, 'views'));
app.use(express.static(path.join(dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.get('/set-user-id-in-cookie/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    res.cookie('userId', userId, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true }); 
    res.send('Cookies set');
});

// Пример маршрута, где вы можете увидеть установленный ID
app.get('/check-cookie', (req, res) => {
    const userId = req.cookies.userId;
    res.send(`current uid: ${userId}`);
});

app.use(`/${API}/movies`, moviesRoutes);

app.use((err: Error, _: express.Request, res: express.Response, next: NextFunction) => {
    // TODO check headerSent response value?
    let statusCode = 500;
    let message = 'Internal server error';
    if (err instanceof Fr7Error) {
        statusCode = err.statusCode;
        message = err.message;
    } else {
        // TODO add normal logger
        console.error(err);
    }
    res.render('error', {status: statusCode, message: message});
    return; 
});

app.listen(PORT, () => {
    console.log(`APP is running on http://localhost:${PORT}/${API}/movies`);
});

