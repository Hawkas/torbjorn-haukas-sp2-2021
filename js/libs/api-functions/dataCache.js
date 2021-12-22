import fetchData from "./fetchData.js";
import { getFromSession, saveToSession } from "../storageHelper.js";
import { BASE_URL } from "../../settings.js";

const dataCache = async () => {
	try {
		//* If nothing is in sessionstorage on the 'strapi-data' key
		if (getFromSession("strapi-data")[0] === undefined) {
			let productsArray = await fetchData(`${BASE_URL}/products`);
			saveToSession("strapi-data", productsArray);
			console.log("I made an API call");
		}
		return getFromSession("strapi-data");
	} catch (error) {
		throw error; // Throw it out to the try..catch outside.
	}
};
export default dataCache;
