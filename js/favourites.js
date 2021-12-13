import fetchData from "./libs/fetchData.js";
import { getFromStorage, filterFromFavourites, removeKeyFromStorage } from "./libs/localStorageHelper.js";
import renderToHtml from "./components/renderToHtml.js";
import { BASE_URL } from "./settings.js";
import adjustMenu from "./components/adjustMenu.js";
import { apiError, noFavourites } from "./components/staticErrorMessage.js";

adjustMenu();

const clearAllButton = document.querySelector(".btn__clear-storage");

function renderArticles(objectArray) {
	//* Get favourites array from localstorage, and filter the array from the API with it
	let favouritesArray = getFromStorage("favourites");
	let filteredArray = filterFromFavourites(objectArray, favouritesArray);

	try {
		//* Render the filtered array to the DOM.
		renderToHtml(filteredArray);
		//? The following code will only execute if the array has any content
		clearAllButton.disabled = false;
		const icons = document.querySelectorAll(".fa-heart.card__icon");
		for (let element of icons) {
			//* When an element is 'unfavourited', rerun the render operation.
			element.addEventListener("click", () => {
				renderArticles(objectArray);
			});
		}
	} catch (error) {
		//* If the array is empty, renderToHtml will throw an exception out to this try..catch
		noFavourites();
	}
}

try {
	const articlesArray = await fetchData(`${BASE_URL}/articles`);
	clearAllButton.addEventListener("click", () => {
		if (window.confirm("Do you really want to clear your favourites?")) {
			removeKeyFromStorage("favourites");
			clearAllButton.disabled = true;
			renderArticles(articlesArray);
		}
	});
	renderArticles(articlesArray);
} catch (error) {
	console.error(error);
	apiError();
}
