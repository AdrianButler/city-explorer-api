class Cache
{

	#cache = {
		testMovie:
			{
				data: null, // holds array of data to send in request
				timeStamp: null // holds Date.now();
			}
	};


	searchCache(key)
	{
		return this.#cache[key] || false;
	}

	addToCache(key, data)
	{
		this.#cache[key] = data;
	}
}

module.exports = Cache;
