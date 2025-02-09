const express  = require('express');
const crypto = require('crypto');

const app = express();
app.disable('x-powered-by');

const movies = require('./movies.json');
const  {validateMovie, validatePartialMovie} = require('./schemes/movieSchema');

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // esto habilita que cualquier origen (dominio) pueda hacer peticiones a nuestra API
    next();
});

app.get('/movies', (req, res) => {

  const {genre} = req.query;

  if (genre) {
    const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
    return res.json(filteredMovies);
  }
  res.json(movies);
});

app.get('/movies/:id', (req, res) => {
    const {id} = req.params;
    console.log('id', id);
    const movie = movies.find(movie => movie.id == id);

    if (movie) {
        res.json(movie);
    }

    res.status(404).json({
        message: 'Not found'
    });
});

app.post('/movies', (req, res) => {
  
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({
      message: JSON.parse(result.error.message),
    });
  }

  const newMovie = {
      id: crypto.randomUUID(),
      ...result.data
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
} );

app.patch('/movies/:id', (req, res) => {
    const {id} = req.params;
    const movieIndex = movies.findIndex(movie => movie.id == id);

    if (movieIndex === -1) {
        return res.status(404).json({
            message: 'Not found'
        });
    }

    const result = validatePartialMovie(req.body);

    if (result.error) {
        return res.status(400).json({
            message: JSON.parse(result.error.message),
        });
    }

    movies[movieIndex] = {
        ...movies[movieIndex],
        ...result.data
    };

    res.json(movies[movieIndex]);
});
// 404
app.use((req, res) => {
    res.status(404).json({
        message: 'Not found'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});