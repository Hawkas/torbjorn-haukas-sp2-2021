import { localStorageParse } from "../../libs/storageHelper.js";
import { apiPropertyKeys } from "../../settings.js";

const {
	itemKeyName: titleKey,
	itemKeyAuthor: creatorKey,
	itemKeyContent: descriptionKey,
	itemKeyPrice: priceKey,
} = apiPropertyKeys;

export const imageSorter = function (imageMedia, size = "medium") {
	let formats = imageMedia.formats;
	let alt = imageMedia.alternativeText;
	const { url, height, width, id } = formats[`${size}`];
	return { url, height, width, alt, id };
};

export const sortProperties = function (object, dashboardBoolean, singleProduct = false) {
	let title = object[`${titleKey}`];
	let creator = object[`${creatorKey}`];
	let description = object[`${descriptionKey}`];
	let id = object.id;
	let price = object[`${priceKey}`];
	let image = imageSorter(object.image_media);
	let cardButtons = "";
	let inCart = "add-to-cart";
	let faClass = "far";
	let removeHover = "";
	//* If the object is found in localStorage, make sure it has the proper styling
	let isInCart = localStorageParse({ id: id }, "cart");
	let isInStorage = localStorageParse({ id: id }, "favourites");

	if (isInCart !== undefined) {
		inCart = "add-to-cart remove-from-cart";
	}
	if (isInStorage !== undefined) {
		faClass = "far fas";
	}
	if (dashboardBoolean) {
		removeHover = "card__dashboard";
	}

	if (!image.alt) image.alt = `${title} by ${creator}`;
	if (singleProduct) {
		return { title, creator, description, id, image, price, cardButtons, removeHover };
	}
	cardButtons = `
	<button
		class="cards__favourite button__outlined"
		aria-label="Save to favourites"
		data-bs-tooltip="tooltip"
		data-bs-trigger="hover"
		data-bs-placement="bottom"
		title="Save to favourites"
	>
		<i class="${faClass} fa-heart"></i>
	</button>
	<button data-cards-btn-id="${id}" class="button__primary cards__cart ${inCart}">
		<span class="fa-layers fa-fw">
			<i class="far fa-shopping-cart"></i>
			<span class="far fa-slash"></span>
		</span>
		<span class="cards__btntext">${isInCart ? "Remove" : "Add To Cart"}</span>
	</button>`;
	if (dashboardBoolean) {
		cardButtons = `
		<button
			class="cards__edit button__outlined"
			data-id="${id}"
			data-modal="edit"
			data-bs-toggle="modal"
			data-bs-target="#staticBackdrop"
			aria-label="Edit product"
			data-bs-tooltip="tooltip"
			data-bs-trigger="hover"
			data-bs-placement="bottom"
			title="Edit product"
		>
			<i class="far fa-edit"></i>
		</button>
		<button data-delete="${id}" class="button__primary cards__primary cards__delete">
				<i class="far fa-trash-alt"></i>
			<span class="cards__btntext ps-2">Delete</span>
		</button>`;
	}
	return { title, creator, description, id, image, price, cardButtons, removeHover };
};
