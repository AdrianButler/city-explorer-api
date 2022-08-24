"use strict";

require("dotenv").config();

const express = require("express");
const weather = require("./data/weather.json");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, () =>
{
    console.log(`City-Explorer api is up on port ${PORT}`);
})

