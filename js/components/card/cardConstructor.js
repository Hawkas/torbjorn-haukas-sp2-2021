import { localStorageParse, createStorageObject, localAddOrRemove } from "../../libs/storageHelper.js";
import { toggleDisabled } from "../../libs/utilities.js";
import { sortProperties } from "./cardUtilities.js";

export const buildCardHtml = function (object, dashboardBoolean = false) {
	let { title, creator, description, id, image, price, cardButtons, removeHover } = sortProperties(object, dashboardBoolean);
	let schrodingersLink = "a";
	let href = ` href="./product.html?id=${id}"`;
	if (dashboardBoolean) {
		schrodingersLink = "div";
		href = "";
	}
	let cardHtml = `
    <article class="col cards__cardwrap" data-card-id="${id}">
        <${schrodingersLink + href}" class="card cards__card ${removeHover}">
            <div class="cards__imgwrap">
				<img
					src="${image.url}"
					width="${image.width}"
					height="${image.height}"
					alt="${image.alt}"
					class="card-img-top cards__img"
				/>
			</div>
            <div class="card-body cards__body">
                <p class="cards__creator card-subtitle">
                    <i class="far fa-user"></i>
                    <span>${creator}</span>
                </p>
                <h3 class="card-title cards__title text-truncate">${title}</h3>
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
				data-image-id="${image.id}"
                data-image-alt="${image.alt}"
                data-image-height="${image.height}"
                data-image-width="${image.width}"   
            >
			${cardButtons}
            </div>
        </${schrodingersLink}>
    </article>`;

	return cardHtml;
};
export const toggleButtonState = function (e) {
	e.preventDefault();
	e.stopPropagation();
	const counterIcon = document.querySelector(".navigation__counter");
	let parentContainer = this.parentNode;
	let objectId = parentContainer.dataset.id;
	let isInStorage = localStorageParse({ id: objectId }, "cart");
	let willBeStored = false;
	//* If this is true, it will be added to storage.
	//* If false, it is very soon going to be removed.
	if (isInStorage === undefined) {
		willBeStored = true;
	}
	counterIcon.dispatchEvent(new CustomEvent("cartChange", { detail: willBeStored })); //? So tell the counter about it.
	toggleDisabled(this);

	localAddOrRemove(createStorageObject(parentContainer), "cart");
	setTimeout(() => {
		//* Toggle button states depending on the operation being performed
		this.lastElementChild.innerHTML = willBeStored ? "Remove" : "Add To Cart";
		this.classList[`${willBeStored ? "add" : "remove"}`]("remove-from-cart");
		toggleDisabled(this);
	}, 500);
};
export const addCartButtonEvents = function (element) {
	element.addEventListener("click", toggleButtonState);
	element.addEventListener("tossFromCart", toggleButtonState);
	//* Handling localstorage in same place to avoid headache.
};
export const addFavouriteButtonEvents = function (element) {
	element.addEventListener("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		//* Toggle class to change heart's appearence when item is saved
		let hearts = this.firstElementChild;
		let parentContainer = element.parentNode;
		let boolNegate = hearts.dataset.prefix === "fas";
		hearts.dataset.prefix = boolNegate ? "far" : "fas";

		//* Create object to be added or removed to/from local storage
		localAddOrRemove(createStorageObject(parentContainer), "favourites");
		//* Add or remove object to localstorage
	});
	//* Making it trigger using the enter key:
	element.onkeyup = function (e) {
		if (e.keyCode === 13) {
			element.click();
		}
	};
};
