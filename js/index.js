import fetchData from "./libs/fetchData.js";
import renderToHtml from "./components/renderToHtml.js";
import adjustInterface from "./components/adjustInterface.js";
import addSearchFunctionality from "./components/addSearchFunctionality.js";
import { apiError, emptyApi } from "./components/staticErrorMessage.js";
import { BASE_URL } from "./settings.js";

adjustInterface();

try {
	let productsArray = await fetchData(`${BASE_URL}/products`);

	try {
		console.log(productsArray);
		// Add functionality for search inputs and suggestions list

		// Render all items in API call to DOM
	} catch (error) {
		console.log(error);
		emptyApi();
	}
} catch (error) {
	console.error(error);
	apiError();
}
