import renderToHtml from "./renderToHtml.js";
import { noResults } from "./staticErrorMessage.js";
import searchArray from "./../libs/searchArray.js";
import { apiPropertyKeys } from "../settings.js";
import { arrowKeyNavigation, hideOnBlur } from "../libs/utilityFunctions.js";

const { itemKeyName, itemKeyAuthor } = apiPropertyKeys;
const input = document.querySelector(".input-name");
const form = document.querySelector(".navbar__search");
const suggestionList = document.querySelector(".suggestions");
const clearInputButton = document.querySelector("#clear-button");

//* Cheap band-aid to avoid duplicate listeners when reloading after adding/deleting/editing products. A better solution would be too much work and I'm lazy.
let dejavuChecker = false;

//* To confirm whether or not suggestion list has content
let suggestionsBoolean = false;

const addSuggestions = function (array, filterString, dashboardBoolean = false) {
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
            <li class="suggestions__value" tabindex="0" data-name="${itemObj[`${itemKeyName}`]}" data-index="${index}">
            ${itemObj[`${itemKeyName}`]} - <span>${itemObj[`${itemKeyAuthor}`]}<span>
            </li>`;
			index++;
		}
		suggestionList.innerHTML = newHtml;

		//* Add click events to fill input with value selected from suggestions, and promptly rerender the content
		const suggestionValueArray = document.querySelectorAll(".suggestions__value");
		for (let suggestionValue of suggestionValueArray) {
			suggestionValue.addEventListener("click", function () {
				let suggestionString = suggestionValue.dataset.name;
				input.value = suggestionString;
				addSuggestions(array, suggestionString);
				renderToHtml(array, suggestionString, dashboardBoolean);
				suggestionList.classList.remove("shown");
			});

			//* Make suggestion list possible to navigate with keyboard
			suggestionValue.addEventListener("keyup", function (e) {
				arrowKeyNavigation(e, this, suggestionValueArray, input);
			});

			suggestionValue.addEventListener("blur", function () {
				hideOnBlur(form, suggestionList);
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

function rebuildToAvoidDuplicateListeners(element) {
	let newEl = element.cloneNode(false);
	while (element.hasChildNodes()) newEl.appendChild(element.firstChild);
	element.parentNode.replaceChild(newEl, element);
}

function addSearchFunctionality(objectArray, dashboardBoolean = false) {
	if (dejavuChecker) {
		rebuildToAvoidDuplicateListeners(clearInputButton);
		rebuildToAvoidDuplicateListeners(input);
	}

	clearInputButton.addEventListener("click", function clearTheInput() {
		input.value = "";
		addSuggestions(objectArray, input.value, dashboardBoolean);
		renderToHtml(objectArray);
	});

	clearInputButton.addEventListener("keyup", function moveLeftOrEnter(e) {
		//* Invoke click event when pressing enter
		if (e.keyCode === 13) {
			this.click();
		}
		//* Left arrow key
		if (e.keyCode === 37) {
			input.focus();
		}
	});

	input.addEventListener("keyup", function moveRightToButton(e) {
		if (e.keyCode === 39) {
			clearInputButton.focus();
		}
	});

	input.addEventListener("input", function handleInput() {
		//* Render matching cards to the DOM
		try {
			renderToHtml(objectArray, input.value);
		} catch (error) {
			noResults();
		}
		//* Add matching items to suggestions list
		addSuggestions(objectArray, input.value);
	});

	input.addEventListener("focus", function handleFocus() {
		addSuggestions(objectArray, input.value);
		suggestionList.classList.add("shown");
		suggestionList.tabIndex = 0;
	});

	//* When input is not in focus, hide suggestions so it doesn't cover the screen forever.

	input.addEventListener("blur", function blurHandler() {
		hideOnBlur(form, suggestionList);
	});
	dejavuChecker = true;
}
export default addSearchFunctionality;
