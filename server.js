"use strict";

require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const weatherBitURL = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}`;
const moviesDBURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}`;

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get("/weather", async (request, response, next) =>
{
	try
	{
		let locationCoordinates = request.query.searchQuery;
		locationCoordinates = locationCoordinates.split(",");

		let locationLat = locationCoordinates[0];
		let locationLon = locationCoordinates[1];

		let weatherBitQueryURL = `${weatherBitURL}&lat=${locationLat}&lon=${locationLon}`;

		let queriedWeatherData = (await axios.get(weatherBitQueryURL)).data.data;

		let forecasts = [];
		queriedWeatherData.forEach((value) =>
		{
			forecasts.push(new Forecast(value));
		});


		response.status(200).send(forecasts);
	} catch (exception)
	{
		console.log(exception);
		response.status(500).send("Error with request");
	}
});

app.get("/movies", async (request, response) =>
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
		})

		response.status(200).send(movies);

	} catch (exception)
	{
		response.status(401).send("Error retrieving movies");
	}
});

app.get("*", (request, response) =>
{
	response.status(400).send("No valid query");
});

app.listen(PORT, () =>
{
	console.log(`City-Explorer api is up on port ${PORT}`);
});

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
		}
		else
		{
			this.imageURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/640px-A_black_image.jpg";
		}
	}
}

class Forecast
{
	constructor(forecastData)
	{
		let date = forecastData.valid_date;
		let lowTemp = forecastData.low_temp;
		let highTemp = forecastData.high_temp;
		let clouds = forecastData.weather.description;

		this.date = date;
		this.description = `Low of ${lowTemp}, high of ${highTemp} with ${clouds.toLowerCase()}.`;
	}
}

