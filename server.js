"use strict";

require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const getForecasts = require("./modules/forecast");
const getMovies = require("./modules/movie.js");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get("/weather", getForecasts);

app.get("/movies", getMovies);

app.get("*", (request, response) =>
{
	response.status(400).send("No valid query");
});

app.listen(PORT, () =>
{
	console.log(`City-Explorer api is up on port ${PORT}`);
});

