import fetchData from "./libs/fetchData.js";
import renderToHtml from "./components/renderToHtml.js";
import addSearchFunctionality from "./components/addSearchFunctionality.js";
import dashboardModal from "./components/dashboardModal.js";
import { apiError, emptyApi } from "./components/staticErrorMessage.js";
import { BASE_URL } from "./settings.js";
import adjustInterface from "./components/adjustInterface.js";

adjustInterface();

try {
	let productsArray = await fetchData(`${BASE_URL}/products`);
	dashboardModal();
	try {
		renderToHtml(productsArray, false, true);
		// Add functionality for search inputs and suggestions list
		addSearchFunctionality(productsArray);
		// Render all items in API call to DOM and add handlers
	} catch (error) {
		emptyApi();
	}
} catch (error) {
	console.error(error);
	apiError();
}
