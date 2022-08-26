"use strict";

const axios = require("axios");
const API = require("./api.js");

const weatherBitURL = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}`;

async function getForecasts(request, response, next)
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
		next(exception);
	}
}

class Forecast extends API
{
	constructor(forecastData)
	{
		super();
		let date = forecastData.valid_date;
		let lowTemp = forecastData.low_temp;
		let highTemp = forecastData.high_temp;
		let clouds = forecastData.weather.description;

		this.date = date;
		this.description = `Low of ${lowTemp}, high of ${highTemp} with ${clouds.toLowerCase()}.`;
	}
}

module.exports = getForecasts;
