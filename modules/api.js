class API
{

	static #cache = {
		testMovie:
			{
				data: null, // holds array of data to send in request
				timeStamp: null // holds Date.now();
			}
	};

	static searchCache(key)
	{
		return API.#cache[key] || false;
	}

	static addToCache(key, data)
	{
		API.#cache[key] = data;
	}
}

module.exports = API;
