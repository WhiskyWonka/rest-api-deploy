import {MovieModel} from '../models/mysql/movie.js';
import { validateMovie, validatePartialMovie } from '../schemes/movieSchema.js';

export class MovieController {
  static async getAll(req, res) {
    const result = validatePartialMovie(req.body);

    if (result.error) {
        return res.status(400).json({
            message: JSON.parse(result.error.message),
        });
    }
    
    const {genre} = req.query;

    const movies = await MovieModel.getAll({genre});
    return res.json(movies);
  }

  static async getById(req, res) {
    const {id} = req.params;
    const movie = await MovieModel.getById({id});

    if (movie) {
      return res.json(movie);
    }

    res.status(404).json({
        message: 'Not found'
    });
  }

  static async create(req, res) {
    const result = validateMovie(req.body);

    if (result.error) {
      return res.status(400).json({
        message: JSON.parse(result.error.message),
      });
    }

    const newMovie = await MovieModel.create({input: result.data});

    res.status(201).json(newMovie);
  }

  static async update(req, res) {
    const result = validatePartialMovie(req.body);

    if (result.error) {
        return res.status(400).json({
            message: JSON.parse(result.error.message),
        });
    }

    const {id} = req.params;

    const movieUpdate = await MovieModel.update({id, input: result.data});

    if (movieUpdate === null) {
      return res.status(404).json({
          message: 'Not found'
      });
    }

    if (req.body.genres) {
      console.log("actualizar generos");
    }

    res.json(movieUpdate);
  }

  static async delete(req, res) {
    const {id} = req.params;
    const movie = await MovieModel.getById({id});

    if (movie === null) {
      return res.status(404).json({
        message: 'Not found'
      });
    }

    await MovieModel.delete({id});

    res.status(204).send();
  }
}