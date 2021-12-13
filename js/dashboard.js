import fetchData from "./libs/fetchData.js";
import renderToHtml from "./components/renderToHtml.js";
import adjustMenu from "./components/adjustMenu.js";
import addSearchFunctionality from "./components/addSearchFunctionality.js";
import dashboardModal from "./components/dashboardModal.js";
import { apiError, emptyApi } from "./components/staticErrorMessage.js";
import { BASE_URL } from "./settings.js";
import { getUser } from "./libs/localStorageHelper.js";
const welcomeMsg = document.querySelector(".welcome");
const pageLoader = document.querySelector("#page_loader");
const user = getUser("user");
pageLoader.style.display = "none";
adjustMenu();
welcomeMsg.innerHTML = `Welcome, ${user.username}`;
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
