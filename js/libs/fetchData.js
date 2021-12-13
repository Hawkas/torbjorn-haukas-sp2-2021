async function fetchData(url) {
	try {
		let response = await axios.get(url);
		return response.data;
	} catch (error) {
		// I want the error to chain into outer try..catches
		throw error;
	}
}

export default fetchData;
