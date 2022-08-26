class CacheableAPI
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
		return CacheableAPI.#cache[key] || false;
	}

	static addToCache(key, data)
	{
		CacheableAPI.#cache[key] = data;
	}
}

module.exports = CacheableAPI;
