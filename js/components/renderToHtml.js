import searchArray from "./../libs/searchArray.js";
import { apiPropertyKeys } from "../settings.js";
import { favouriteHandler } from "../libs/localStorageHelper.js";
import deleteHandler from "./deleteHandler.js";
import { buildCardHtml, addFavoriteButtonEvents } from "./cardConstructor.js";

const {
	itemKeyName: titleKey,
	itemKeyAuthor: creatorKey,
	itemKeyContent: descriptionKey,
	itemKeyPrice: priceKey,
} = apiPropertyKeys;

function renderToHtml(array, filterString = false, dashboardBoolean = false) {
	try {
		const cardsContainer = document.querySelector(".cards__container");

		//* If called by search inputs, filter the contents of the array
		if (filterString) {
			array = searchArray(array, filterString);
		}
		cardsContainer.innerHTML = "";
		if (array.length >= 1) {
			for (let object of array) {
				cardsContainer.innerHTML += buildCardHtml(object, dashboardBoolean);
			}
			// Add event listeners to buttons after rendering
			const icons = document.querySelectorAll(".fa-heart.card__icon");
			for (let element of icons) {
				addFavoriteButtonEvents(element);
			}
			//* Add handlers for delete buttons if on dashboard
			if (dashboardBoolean) {
				deleteHandler();
			}
		} else {
			throw "Empty array";
		}
	} catch (error) {
		//! This should only occur if this function is called to evaluate a search string with no results, or the user has no favourites to show.
		// Passing the error on to an outer try..catch to inject whatever message is suitable into the HTML
		throw error;
	}
}

export default renderToHtml;
