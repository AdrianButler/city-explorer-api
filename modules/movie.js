"use strict";

const axios = require("axios");
const moviesDBURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}`;

async function getMovies(request, response, next)
{

	const query = request.query.searchQuery;
	const movieDBQueryURL = `${moviesDBURL}&query=${query}`;
	try
	{
		console.log(movieDBQueryURL);
		let movieDBResponse = (await axios.get(movieDBQueryURL)).data.results;

		let movies = movieDBResponse.map((movie) =>
		{
			return new Movie(movie);
		});

		response.status(200).send(movies);

	} catch (exception)
	{
		next(exception);
		// response.status(401).send("Error retrieving movies");
	}
}

class Movie
{
	constructor(movie)
	{
		this.title = movie.title;
		this.overview = movie.overview;
		this.averageVotes = movie.vote_average;
		this.totalVotes = movie.vote_count;
		this.popularity = movie.popularity;
		this.releaseDate = movie.release_date;

		if (movie.backdrop_path != null)
		{
			this.imageURL = `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`;
		} else
		{
			this.imageURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/640px-A_black_image.jpg";
		}
	}
}


module.exports = getMovies;
