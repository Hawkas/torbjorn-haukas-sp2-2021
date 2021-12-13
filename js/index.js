import fetchData from "./libs/fetchData.js";
import renderToHtml from "./components/renderToHtml.js";
import adjustMenu from "./components/adjustMenu.js";
import addSearchFunctionality from "./components/addSearchFunctionality.js";
import { apiError, emptyApi } from "./components/staticErrorMessage.js";
import { BASE_URL } from "./settings.js";

adjustMenu();

try {
	let productsArray = await fetchData(`${BASE_URL}/products`);

	try {
		renderToHtml(productsArray);
		// Add functionality for search inputs and suggestions list
		addSearchFunctionality(productsArray);
		// Render all items in API call to DOM
	} catch (error) {
		console.log(error);
		emptyApi();
	}
} catch (error) {
	console.error(error);
	apiError();
}
