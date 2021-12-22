import renderToHtml from "./renderToHtml.js";
import { noResults } from "./staticErrorMessage.js";
import searchArray from "./../libs/searchArray.js";
import { apiPropertyKeys } from "../settings.js";
import { arrowKeyNavigation } from "../libs/utilities.js";

const { itemKeyName, itemKeyAuthor } = apiPropertyKeys;
const input = document.querySelector("#search-input");
const form = document.querySelector(".search");
const suggestionList = document.querySelector(".suggestions");
const clearInputButton = document.querySelector("#clear-button");

//* Cheap band-aid to avoid duplicate listeners when reloading after adding/deleting/editing products

//* To confirm whether or not suggestion list has content
let suggestionsBoolean = false;

function moveLeftOrEnter(e) {
	//* Invoke click event when pressing enter
	if (e.keyCode === 13) {
		this.click();
	}
	//* Left arrow key
	if (e.keyCode === 37) {
		input.focus();
	}
}

function moveRightToButton(e) {
	if (e.keyCode === 39) {
		clearInputButton.focus();
	}
}

function handleInput() {
	//* Render matching cards to the DOM
	let filterString = input.value;
	try {
		renderToHtml(this.objectArray, { filterString, dashboardBoolean: this.dashboardBoolean });
	} catch (error) {
		noResults();
	}
	//* Add matching items to suggestions list
	addSuggestions(this.objectArray, { filterString, dashboardBoolean: this.dashboardBoolean });
}

function handleFocus() {
	addSuggestions(this.objectArray, { filterString: input.value, dashboardBoolean: this.dashboardBoolean });
	suggestionList.classList.add("shown");
	input.ariaExpanded = true;
	suggestionList.tabIndex = 0;
}
function blurHandler() {
	hideOnBlur(form, suggestionList);
}
export const hideOnBlur = function (parentContainer, elementToHide) {
	//* On blur, hide the suggestions dropdown unless anything inside the 'form' element is in focus/being navigated with keyboard
	//? setTimeout is needed in order for click event on suggestions to auto-fill input before suggestion list disappears.
	setTimeout(() => {
		if (!parentContainer.contains(document.activeElement)) {
			elementToHide.classList.remove("shown");
		}
	}, 150);
};

const addSuggestions = function (array, options = {}) {
	const { filterString = "", dashboardBoolean = false } = options;
	let newHtml = "";
	suggestionList.innerHTML = "";
	//* If the input is NOT empty
	if (filterString !== "") {
		suggestionsBoolean = true;
		//* Create a new array based on value of the input.
		let filteredArray = searchArray(array, filterString);
		let index = 0;
		for (let itemObj of filteredArray) {
			//* Using this array, create HTML to use in the suggestions list, displaying title and author.
			newHtml += `
            <li role="option" class="suggestions__value" tabindex="0" data-name="${
							itemObj[`${itemKeyName}`]
						}" data-index="${index}">
            ${itemObj[`${itemKeyName}`]} - <span>${itemObj[`${itemKeyAuthor}`]}<span>
            </li>`;
			index++;
		}
		suggestionList.innerHTML = newHtml;

		//* Add click events to fill input with value selected from suggestions
		const suggestionValueArray = document.querySelectorAll(".suggestions__value");
		for (let suggestionValue of suggestionValueArray) {
			suggestionValue.addEventListener("click", () => {
				let suggestionString = suggestionValue.dataset.name;
				//* Change inputs value to the selected option
				input.value = suggestionString;
				input.dispatchEvent(new Event("input", { bubbles: false }));
				input.ariaExpanded = false;
				//* And hide the suggestions list preemptively.
				suggestionList.classList.remove("shown");
			});

			//* Make suggestion list possible to navigate with keyboard
			suggestionValue.addEventListener("keyup", function (e) {
				arrowKeyNavigation(e, this, suggestionValueArray, input);
			});

			suggestionValue.addEventListener("blur", function () {
				hideOnBlur(form, suggestionList);
				input.ariaExpanded = false;
			});
		}

		//* If arrow key down is used from the search bar, drop down to suggestion list
		input.addEventListener("keyup", function (e) {
			if (suggestionsBoolean && e.keyCode === 40) {
				suggestionValueArray[0].focus();
			}
		});
	} else {
		suggestionsBoolean = false;
	}
};

function addSearchFunctionality(objectArray, options = {}) {
	const { dashboardBoolean = false } = options;
	input.dashboardBoolean = dashboardBoolean;
	input.objectArray = objectArray;
	//! I have no clue why I didn't think of this sooner.
	//! I could've saved myself so many headaches.

	clearInputButton.addEventListener("click", function clearTheInput() {
		input.value = "";
		addSuggestions(objectArray, { filterString: input.value, dashboardBoolean });
		renderToHtml(objectArray, { dashboardBoolean });
	});

	clearInputButton.addEventListener("keyup", moveLeftOrEnter);

	input.addEventListener("keyup", moveRightToButton);

	input.addEventListener("input", handleInput);

	input.addEventListener("focus", handleFocus);

	//* When input is not in focus, hide suggestions so it doesn't cover the screen forever.

	input.addEventListener("blur", blurHandler);
}
export default addSearchFunctionality;
