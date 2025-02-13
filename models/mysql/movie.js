import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

const config = {
  host: '172.29.224.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'moviesdb'
};

const connection = await mysql.createConnection(config);

export class MovieModel {

  static async getAll  ({genre}){
    
    let query = `
    SELECT BIN_TO_UUID(m.id) AS id, m.title, m.year, m.director, m.duration, m.poster 
    FROM movies m
    `;
    
    if (genre) {
      query = query + `
        JOIN movie_genres mg ON mg.movie_id = m.id
        JOIN genres g ON g.id = mg.genre_id 
        WHERE g.name = ?
        `;
    }

    const [movies] = await connection.query(query, genre ? [genre] : []);

    for (const movie of movies) {
      const genres = await this.getGenresByMovieId({ movieId: movie.id });
      movie.genres = genres.map(genre => genre.genre);
    }

    return movies;
  }

  static async getGenresByMovieId({movieId}) {
    const [genres] = await connection.query(`
      SELECT g.name as genre
      FROM movie_genres mg
      JOIN genres g ON mg.genre_id = g.id
      WHERE mg.movie_id = UUID_TO_BIN(?)
    `, [movieId]);

    // console.log(genres);

    return genres;
  }

  static async getById({id}) {
    const [movie] = await connection.query(`
      SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate
      FROM movies
      WHERE id = UUID_TO_BIN(?)
      `, [id]);
      
    if (movie.length === 0) {
      return null;
    }

    const genres = await this.getGenresByMovieId({ movieId: movie[0].id });
    movie[0].genres = genres.map(genre => genre.genre);

    return movie[0];
  }

  static async create({input}) {
    const newId = uuidv4();

    const [result] = await connection.query(`
      INSERT INTO movies (id, title, year, director, duration, poster, rate)
      VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)
    `, [newId, input.title, input.year, input.director, input.duration, input.poster, input.rate]);

    const genresIds = await this.getGenresIdsByNames({genres: input.genres});

    const [newMovie] = await connection.query(`
      SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate 
      FROM movies
      WHERE id = UUID_TO_BIN(?)
    `, [newId]);

    for (const genreId of genresIds) {
      await connection.query(`
      INSERT INTO movie_genres (movie_id, genre_id)
      VALUES (UUID_TO_BIN(?), ?)
      `, [newId, genreId]);
    }

    const genres = await this.getGenresByMovieId({ movieId: newId});
    newMovie[0].genres = genres.map(genre => genre.genre);

    return newMovie[0];
  }

  static async getGenresIdsByNames({genres}) {
    const [result] = await connection.query(`
      SELECT id
      FROM genres
      WHERE name IN (?)
    `, [genres]);

    return result.map(genre => genre.id);
  }

  static async update({id, input}) {

    const movie = await MovieModel.getById({id});

    if (movie === null) {
      return null;
    }

    const genres = await this.getGenresByMovieId({ movieId: id });

    if (genres.length == 0) {
      return null;
    }

    const movieModified = {
      ...movie,
      ...input
    };

    const [result] = await connection.query(`
      UPDATE movies
      SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ?
      WHERE id = UUID_TO_BIN(?)
    `, [movieModified.title, movieModified.year, movieModified.director, movieModified.duration, movieModified.poster, movieModified.rate, id]);

    const updatedMovie = await this.getById({id});

    return updatedMovie;
  }

  static async delete({id}) {

  }
}