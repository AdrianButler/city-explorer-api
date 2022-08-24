"use strict";

require("dotenv").config();

const express = require("express");
const weather = require("./data/weather.json");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get("/weather", (request, response, next) =>
{
	try
	{
		let locationName = request.query.searchQuery;
		let locationWeatherData = weather.find(location => location.city_name === locationName);
		locationWeatherData = locationWeatherData.data;

		let forecasts = [];
		locationWeatherData.forEach((value) =>
		{
			forecasts.push(new Forecast(value));
		});


		response.status(200).send(forecasts);
	}
	catch (exception)
	{
		response.status(500).send("Error with request");
	}
});


app.listen(PORT, () =>
{
	console.log(`City-Explorer api is up on port ${PORT}`);
});

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

