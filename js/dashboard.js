import fetchData from "./libs/api-functions/fetchData.js";
import renderToHtml from "./components/renderToHtml.js";
import addSearchFunctionality from "./components/addSearchFunctionality.js";
import dashboardModal from "./components/dashboardModal.js";
import { apiError, emptyApi } from "./components/staticErrorMessage.js";
import adjustInterface from "./components/adjustInterface.js";
import dataCache from "./libs/api-functions/dataCache.js";

adjustInterface();

try {
	const productsArray = await dataCache();
	dashboardModal();
	try {
		renderToHtml(productsArray, { dashboardBoolean: true });
		// Add functionality for search inputs and suggestions list
		addSearchFunctionality(productsArray, { dashboardBoolean: true });
		// Render all items in API call to DOM and add handlers
	} catch (error) {
		console.error(error);
		emptyApi(); // If this error message is thrown, it's a problem
	}
} catch (error) {
	console.error(error);
	apiError();
}
