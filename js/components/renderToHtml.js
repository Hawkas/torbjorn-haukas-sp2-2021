import searchArray from "./../libs/searchArray.js";
import deleteHandler from "./deleteHandler.js";
import { buildCardHtml, addFavouriteButtonEvents, addCartButtonEvents } from "./cardConstructor.js";

function renderToHtml(array, filterString = false, dashboardBoolean = false, featured = false) {
	try {
		const cardsContainer = document.querySelector(".cards__grid");

		//* If called by search inputs, filter the contents of the array
		if (filterString) {
			array = searchArray(array, filterString);
		}
		if (featured) {
			array.filter(function (object) {
				if (object.featured === true) {
					return true;
				}
			});
		}
		cardsContainer.innerHTML = "";
		if (array.length >= 1) {
			for (let object of array) {
				cardsContainer.innerHTML += buildCardHtml(object, dashboardBoolean);
			}
			// Add event listeners to buttons after rendering
			const buttons = document.querySelectorAll(".cards__cart");
			const icons = document.querySelectorAll(".cards__favourite");
			for (let button of buttons) {
				addCartButtonEvents(button);
			}
			for (let icon of icons) {
				addFavouriteButtonEvents(icon);
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
