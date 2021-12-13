import fetchData from "./libs/fetchData.js";
import renderToHtml from "./components/renderToHtml.js";
import adjustMenu from "./components/adjustMenu.js";
import addSearchFunctionality from "./components/addSearchFunctionality.js";
import { apiError, emptyApi } from "./components/staticErrorMessage.js";
import { BASE_URL } from "./settings.js";

adjustMenu();

try {
	let articlesArray = await fetchData(`${BASE_URL}/articles`);

	try {
		renderToHtml(articlesArray);
		// Add functionality for search inputs and suggestions list
		addSearchFunctionality(articlesArray);
		// Render all items in API call to DOM
	} catch (error) {
		console.log(error);
		emptyApi();
	}
} catch (error) {
	console.error(error);
	apiError();
}
