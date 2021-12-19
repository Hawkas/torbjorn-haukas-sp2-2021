import { apiPropertyKeys } from "../settings.js";
import { getFromStorage, favouriteHandler } from "../libs/localStorageHelper.js";

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

	let favourites = getFromStorage("favourites");
	let cart = getFromStorage("cart");

	let cardHtml = "";

	//* If the object is in cart, cart button should reflect this.
	let isInCart = cart.find((savedObject) => savedObject.id === id);

	let isInStorage = favourites.find((savedObject) => savedObject.id === id);

	//* If the object is found in localStorage, make sure it has the proper visual indicator
	let faClass = "far";
	if (isInCart !== undefined) {
		inCart = "remove";
	}
	if (isInStorage !== undefined) {
		faClass = "far fas";
	}

	if (image.alt === "") image.alt = `${title} by ${creator}`;

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
            <div class="cards__footer">
                <button
                    class="cards__favourite button__outlined"
                    aria-label="Save to favourites"
                    data-bs-tooltip="tooltip"
                    data-bs-trigger="hover"
                    data-bs-placement="top"
                    data-id="${id}"
                    data-
                    title="Save to favourites"
                >
                    <i class="${faClass} fa-heart"></i>
                </button>
                <button class="button__primary cards__cart ${inCart}">
                    <span class="fa-layers fa-fw">
                        <i class="far fa-shopping-cart"></i>
                        <span class="far fa-slash"></span>
                    </span>
                    <span class="cards__btntext">Add To Cart</span>
                </button>
            </div>
        </div>
    </article>`;
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
