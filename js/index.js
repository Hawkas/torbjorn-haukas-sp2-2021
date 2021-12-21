import renderToHtml from "./components/renderToHtml.js";
import adjustInterface from "./components/adjustInterface.js";
import { apiError, emptyApi } from "./components/staticErrorMessage.js";
import dataCache from "./libs/api-functions/dataCache.js";

adjustInterface();

try {
	let productsArray = await dataCache();

	try {
		console.log(productsArray);
		// Render all items in API call to DOM
		renderToHtml(productsArray, { featured: true });
	} catch (error) {
		console.log(error);
		emptyApi(); // This error occurs when the server responds but there is no content.
	}
} catch (error) {
	console.error(error);
	apiError(); // This error occurs when the URL fetch fails.
}
