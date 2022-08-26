"use strict";

const axios = require("axios");
const cacheableAPI = require("./api.js");

const moviesDBURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}`;


async function getMovies(request, response, next)
{

	const query = request.query.searchQuery;
	const movieDBQueryURL = `${moviesDBURL}&query=${query}`;
	try
	{
		let movieDBResponse;
		console.log(movieDBQueryURL);

		let cacheSearch = Movie.searchCache(query);
		if (cacheSearch && (Date.now() - cacheSearch.timeStamp < 1000 * 60 * 60 * 2))
		{
			movieDBResponse = cacheSearch.data;
			console.log("using cache");
		} else
		{

			movieDBResponse = (await axios.get(movieDBQueryURL)).data.results;

			movieDBResponse = movieDBResponse.map((movie) =>
			{
				return new Movie(movie);
			});


			if (!Movie.searchCache(query))
			{
				let cacheObject = {
					data: movieDBResponse,
					timeStamp: Date.now()
				};
				Movie.addToCache(query, cacheObject);
			}

		}
		response.status(200).send(movieDBResponse);

	} catch (exception)
	{
		next(exception);
	}
}

class Movie extends cacheableAPI
{
	constructor(movie)
	{
		super();
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
			this.imageURL = "https://i.ibb.co/rkMqdvt/filler.jpg";
		}
	}
}


module.exports = getMovies;
