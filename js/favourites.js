import dataCache from "./libs/api-functions/dataCache.js";
import { getFromLocal, filterFromFavourites, removeKeyFromStorage } from "./libs/storageHelper.js";
import renderToHtml from "./components/renderToHtml.js";
import { BASE_URL } from "./settings.js";
import adjustMenu from "./components/navigation/adjustInterface.js";
import { apiError, noFavourites } from "./components/staticErrorMessage.js";
import addSearchFunctionality from "./components/addSearchFunctionality.js";

adjustMenu();

const clearAllButton = document.querySelector(".button__clearall");

function renderProducts(objectArray) {
	let favouritesArray = getFromLocal("favourites");
	let filteredArray = filterFromFavourites(objectArray, favouritesArray);

	try {
		//* Render the filtered array to the DOM.
		renderToHtml(filteredArray);
		addSearchFunctionality(filteredArray);
		//? The following code will only execute if the array has any content
		clearAllButton.disabled = false;
		const icons = document.querySelectorAll(".cards__favourite");
		for (let element of icons) {
			//* When an element is 'unfavourited', rerun the render operation.
			element.addEventListener("click", () => {
				renderProducts(objectArray);
			});
		}
	} catch (error) {
		//* If the array is empty, renderToHtml will throw an exception out to this try..catch
		noFavourites();
	}
}

try {
	const productsArray = await dataCache();
	clearAllButton.addEventListener("click", () => {
		if (window.confirm("Do you really want to clear your favourites?")) {
			removeKeyFromStorage("favourites");
			clearAllButton.disabled = true;
			renderProducts(productsArray);
		}
	});
	renderProducts(productsArray);
} catch (error) {
	console.error(error);
	apiError();
}
