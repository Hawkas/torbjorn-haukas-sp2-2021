import searchArray from "./../libs/searchArray.js";
import { getFromStorage, favouriteHandler } from "../libs/localStorageHelper.js";
import deleteHandler from "./deleteHandler.js";

function renderToHtml(array, filterString = false) {
	try {
		const cardsContainer = document.querySelector(".cards__container");
		//* Check if page is dashboard
		const dashboardBoolean = window.location.href.includes("dashboard.html");
		//* If called by search inputs, filter the contents of the array
		if (filterString) {
			array = searchArray(array, filterString);
		}
		cardsContainer.innerHTML = "";
		if (array.length >= 1) {
			for (let object of array) {
				let favourites = getFromStorage("favourites");
				let iconsHtml = "";
				let isInStorage = favourites.find((savedObject) => parseInt(savedObject.id) === parseInt(object.id));
				//* If the object is found in localStorage, make sure it has the proper visual indicator
				let faClass = "far";
				if (isInStorage !== undefined) {
					faClass = "far fas";
				}
				iconsHtml = `<i class="${faClass} fa-heart card__icon" aria-label="Add to Favourites" tabindex="0"  data-title="${object.title}" data-id="${object.id}"></i>`;
				//* If the window location is the dashboard, I'm just making a slight alteration to the displayed cards, rather than rewriting them entirely.
				if (dashboardBoolean) {
					iconsHtml = `
					<div class="card__buttons">
						<div class="btn-toolbar" role="toolbar">
							<div class="card__btngroup btn-group" role="group" aria-label="Toolbar buttons">
								<button type="button" aria-label="Delete article" class="btn btn-outline-secondary btn-delete" data-id="${object.id}"><i class="fas fa-trash-alt"></i></button>
								<button type="button" aria-label="Edit article" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-modal="edit" data-id="${object.id}">
									<i class="fas fa-edit"></i>
								</button>
							</div>
						</div>
						<i class="${faClass} fa-heart card__icon" aria-label="Add to Favourites" tabindex="0"  data-title="${object.title}" data-id="${object.id}"></i>
					</div>`;
				}

				cardsContainer.innerHTML += `
					<div class="col card__outer">
						<article class="card h-100">
							<div class="card-body">
								<h2 class="card-title">${object.title}</h2>
								<p class="card-subtitle text-muted mb-2"><i class="fas fa-user"></i> ${object.author}</p>
								<p class="card-text">${object.summary}</p>
								${iconsHtml}
							</div>
						</article>
					</div>`;
			}
			// Add event listeners to buttons after rendering
			const icons = document.querySelectorAll(".fa-heart.card__icon");
			for (let element of icons) {
				element.addEventListener("click", () => {
					//* Toggle class to change heart's appearence when item is saved
					element.classList.toggle("fas");

					//* Create object to be added or removed to/from local storage
					let localStorageObject = {
						id: element.dataset.id,
					};
					//* Add or remove object to localstorage
					favouriteHandler(localStorageObject);
				});
				//* Making it possible to trigger using the enter key:
				element.addEventListener("keyup", function (e) {
					if (e.keyCode === 13) {
						element.click();
					}
				});
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
