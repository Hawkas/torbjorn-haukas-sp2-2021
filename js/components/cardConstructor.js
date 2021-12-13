import { apiPropertyKeys } from "../settings.js";
import { getFromStorage, favouriteHandler } from "../libs/localStorageHelper.js";

const {
	itemKeyName: titleKey,
	itemKeyAuthor: creatorKey,
	itemKeyContent: descriptionKey,
	itemKeyPrice: priceKey,
} = apiPropertyKeys;

export const buildCardHtml = function (object, dashboardBoolean) {
	let title = object[`${titleKey}`];
	let creator = object[`${creatorKey}`];
	let description = object[`${descriptionKey}`];
	let id = object.id;
	let price = object[`${priceKey}`];
	let favourites = getFromStorage("favourites");
	let cardHtml = "";
	let iconsHtml = "";
	let isInStorage = favourites.find((savedObject) => savedObject.id === id);
	//* If the object is found in localStorage, make sure it has the proper visual indicator
	let faClass = "far";
	if (isInStorage !== undefined) {
		faClass = "far fas";
	}
	iconsHtml = `
        <i 
            class="${faClass} fa-heart card__icon" 
            title="Add to favourites" 
            aria-label="Add to Favourites" 
            tabindex="0" 
            data-title="${title}" 
            data-id="${id}"
        >
        </i>`;
	//* If the window location is the dashboard, I'm just making a slight alteration to the displayed cards, rather than rewriting them entirely.
	if (dashboardBoolean) {
		iconsHtml = `
            <div class="card__buttons">
                <div class="btn-toolbar" role="toolbar">
                    <div class="card__btngroup btn-group" role="group" aria-label="Toolbar buttons">
                        <button 
                            type="button"
                            title="Delete article"
                            aria-label="Delete article"
                            class="btn btn-outline-secondary btn-delete"
                            data-id="${id}"
                        >
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <button
                            type="button" 
                            aria-label="Edit article" 
                            class="btn btn-outline-secondary" 
                            data-bs-toggle="modal" 
                            data-bs-target="#staticBackdrop" 
                            data-modal="edit" 
                            data-id="${id}"
                        >
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
                <i class="${faClass}
                    fa-heart card__icon" 
                    title="Add to favourites" 
                    aria-label="Add to Favourites" 
                    tabindex="0" 
                    data-title="${title}" 
                    data-id="${id}"
                >
                </i>
            </div>`;
	}
	cardHtml = `
    <div class="col card__outer">
        <article class="card h-100">
            <div class="card-body">
                <h2 class="card-title">${title}</h2>
                <p class="card-subtitle text-muted mb-2"><i class="fas fa-user"></i> ${creator}</p>
                <p class="card-text">${description}</p>
                ${iconsHtml}
            </div>
        </article>
    </div>`;
	return cardHtml;
};

export const addFavoriteButtonEvents = function (element) {
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
	//* Making it trigger using the enter key:
	element.addEventListener("keyup", function (e) {
		if (e.keyCode === 13) {
			element.click();
		}
	});
};
