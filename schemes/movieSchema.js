const z = require('zod');

const movieSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string'
  }),

  year: z.number({
    required_error: 'Year is required',
    invalid_type_error: 'Year must be a number'
  }).int().min(1900).max(new Date().getFullYear()),

  director: z.string({
    required_error: 'Director is required',
    invalid_type_error: 'Director must be a string'
  }),

  duration: z.number({
    required_error: 'Duration is required',
    invalid_type_error: 'Duration must be a number'
  }).int().min(1),

  poster: z.string({
    required_error: 'Poster is required',
    invalid_type_error: 'Poster must be a url'
  }).url().endsWith('.png'),

  rate: z.number({
    invalid_type_error: 'Rate must be a number'
  }).min(0).max(10).default(0),

  genre: z.array(
    z.enum(['action', 'comedy', 'drama', 'horror', 'romance', 'thriller', 'western', 'animation', 'documentary', 'sci-fi', 'fantasy', 'mystery', 'crime', 'adventure', 'family', 'superhero', 'musical', 'war', 'historical', 'biography', 'sport', 'music', 'spy', 'disaster', 'zombie', 'monster', 'alien', 'post-apocalyptic', 'cyberpunk', 'steampunk', 'time-travel', 'dystopian', 'slasher', 'mockumentary', 'found-footage', 'silent', 'epic', 'surreal', 'satire', 'parody', 'black-comedy', 'dark-comedy', 'romantic-comedy', 'slapstick', 'screwball', 'gross-out']),
    {
    required_error: 'Genre is required',
    invalid_type_error: 'Genre must be an array of strings', 
    }
  )
});

function validateMovie(body) {
  return movieSchema.safeParse(body);
}

function validatePartialMovie(body) {
  return movieSchema.partial().safeParse(body);
}

module.exports = {validateMovie, validatePartialMovie};