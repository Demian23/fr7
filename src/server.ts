import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT;
const API = process.env.API
const dirname = path.dirname(fileURLToPath(import.meta.url)); 

app.set('view engine', 'ejs');
app.set('views', path.join(dirname, 'views'));
app.use(express.static(path.join(dirname, 'public')));

app.get(`/${API}`, (_, res) => {
    res.render('index', {title: "FilmRate7", list: ["Film1", "Film2"]});
});

app.listen(PORT, () => {
    console.log(`APP is running on http://localhost:${PORT}/${API}`);
});
