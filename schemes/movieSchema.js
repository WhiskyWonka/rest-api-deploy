import z  from 'zod';

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
  }).url(),

  rate: z.number({
    invalid_type_error: 'Rate must be a number'
  }).min(0).max(10).default(0),

  genre: z.array(
    z.enum(['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Western', 'Animation', 'Documentary', 'Sci-Fi', 'Fantasy', 'Mystery', 'Crime', 'Adventure', 'Family', 'Superhero', 'Musical', 'War', 'Historical', 'Biography', 'Sport', 'Music', 'Spy', 'Disaster', 'Zombie', 'Monster', 'Alien', 'Post-Apocalyptic', 'Cyberpunk', 'Steampunk', 'Time-Travel', 'Dystopian', 'Slasher', 'Mockumentary', 'Found-Footage', 'Silent', 'Epic', 'Surreal', 'Satire', 'Parody', 'Black-Comedy', 'Dark-Comedy', 'Romantic-Comedy', 'Slapstick', 'Screwball', 'Gross-Out']),
    {
    required_error: 'Genre is required',
    invalid_type_error: 'Genre must be an array of strings', 
    }
  )
});

export function validateMovie(body) {
  return movieSchema.safeParse(body);
}

export function validatePartialMovie(body) {
  return movieSchema.partial().safeParse(body);
}