import { apiPropertyKeys } from "../settings.js";
import { storageObjectParse, createThenValidateStorage } from "../libs/storageHelper.js";

import { toggleDisabled } from "../libs/utilityFunctions.js";

const {
	itemKeyName: titleKey,
	itemKeyAuthor: creatorKey,
	itemKeyContent: descriptionKey,
	itemKeyPrice: priceKey,
} = apiPropertyKeys;
function imageSorter(imageMedia, size = "medium") {
	let formats = imageMedia[0].formats;
	let alt = imageMedia[0].alternativeText;
	const { url, height, width } = formats[`${size}`];
	return { url, height, width, alt };
}
export const buildCardHtml = function (object, featured = false) {
	let title = object[`${titleKey}`];
	let creator = object[`${creatorKey}`];
	let description = object[`${descriptionKey}`];
	let id = object.id;
	let price = object[`${priceKey}`];
	let image = imageSorter(object.image_media);
	let cardHtml = "";

	//* If the object is found in localStorage, make sure it has the proper styling
	let isInCart = storageObjectParse({ id: id }, "cart");
	let isInStorage = storageObjectParse({ id: id }, "favourites");

	let inCart = "add-to-cart";
	let faClass = "far";
	if (isInCart !== undefined) {
		inCart = "add-to-cart remove-from-cart";
	}
	if (isInStorage !== undefined) {
		faClass = "far fas";
	}

	if (!image.alt) image.alt = `${title} by ${creator}`;

	cardHtml = `
    <article class="col cards__cardwrap">
        <div class="card cards__card">
            <img
                src="${image.url}"
                width="${image.width}"
                height="${image.height}"
                alt="${image.alt}"
                class="card-img-top cards__img img-fluid"
                loading="lazy"
            />
            <div class="card-body cards__body">
                <p class="cards__creator card-subtitle">
                    <i class="far fa-user"></i>
                    <span>${creator}</span>
                </p>
                <h3 class="card-title cards__title">${title}</h3>
                <p class="card-text cards__bodytext text-truncate">${description}</p>
                <h4 class="cards__pricelabel card-subtitle">Current Price</h4>
                <p class="cards__price">$${price}</p>
            </div>
            <div class="cards__footer"  
                data-id="${id}"
                data-title="${title}"
                data-creator="${creator}"
                data-desc="${description}"
                data-price="${price}"
                data-image-url="${image.url}"
                data-image-alt="${image.alt}"
                data-image-height="${image.height}"
                data-image-width="${image.width}"
                
            >
                <button
                    class="cards__favourite button__outlined"
                    aria-label="Save to favourites"
                    data-bs-tooltip="tooltip"
                    data-bs-trigger="hover"
                    data-bs-placement="top"
                    title="Save to favourites"
                >
                    <i class="${faClass} fa-heart"></i>
                </button>
                <button data-cards-id="${id}" class="button__primary cards__cart ${inCart}">
                    <span class="fa-layers fa-fw">
                        <i class="far fa-shopping-cart"></i>
                        <span class="far fa-slash"></span>
                    </span>
                    <span class="cards__btntext">${isInCart ? "Remove" : "Add To Cart"}</span>
                </button>
            </div>
        </div>
    </article>`;
	return cardHtml;
};
function toggleButtonState(e) {
	const counterIcon = document.querySelector(".navigation__counter");
	let parentContainer = this.parentNode;
	let objectId = parentContainer.dataset.id;
	let isInStorage = storageObjectParse({ id: objectId }, "cart");
	let willBeStored = false;
	//* If this is true, it will be added to storage.
	//* If false, it is very soon going to be removed.
	if (isInStorage === undefined) {
		willBeStored = true;
	}
	counterIcon.dispatchEvent(new CustomEvent("cartChange", { detail: willBeStored })); //? So tell the counter about it.
	toggleDisabled(this);
	this.classList.toggle("disabled");
	//* If object was not already in storage, change button state to 'remove' pre-emptively.
	//* Otherwise, toggle it back to 'add to cart'
	this.lastElementChild.innerHTML = willBeStored ? "Remove" : "Add To Cart";
	//* This ternary is confusingly opposite, but is for whether or not to add/remove class.
	this.classList[`${willBeStored ? "add" : "remove"}`]("remove-from-cart");
	createThenValidateStorage(parentContainer, "cart");
	setTimeout(() => {
		toggleDisabled(this);
	}, 200);
}
export const addCartButtonEvents = function (element) {
	element.addEventListener("click", toggleButtonState);
	element.addEventListener("tossFromCart", toggleButtonState);
	//* Handling localstorage in same place to avoid headache.
};
export const addFavouriteButtonEvents = function (element) {
	element.addEventListener("click", function (e) {
		//* Toggle class to change heart's appearence when item is saved
		let hearts = this.firstElementChild;
		let parentContainer = element.parentNode;
		let boolNegate = hearts.dataset.prefix === "fas";
		hearts.dataset.prefix = boolNegate ? "far" : "fas";

		//* Create object to be added or removed to/from local storage
		createThenValidateStorage(parentContainer);
		//* Add or remove object to localstorage
	});
	//* Making it trigger using the enter key:
	element.onkeyup = function (e) {
		if (e.keyCode === 13) {
			element.click();
		}
	};
};
