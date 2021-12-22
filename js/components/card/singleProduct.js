import { sortProperties } from "./cardUtilities.js";
import { sessionStorageParse } from "../../libs/storageHelper.js";
const singleProduct = function () {
	const queryString = document.location.search;
	const params = new URLSearchParams(queryString);
	const queryStringId = params.get("id");
	const productObject = sessionStorageParse({ id: queryStringId }, "strapi-data");
	const { title, creator, description, id, image, price } = sortProperties(productObject, false, true);
	document.title = `${title} by ${creator} — Ethereal`;
	return `
    <div class="row row-cols-md-2 row-cols-lg-2 g-3">
        <div class="product__imgwrap col-sm-12">
            <img
                src="${image.url}"
                width="${image.width}"
                height="${image.height}"
                alt="${image.alt}"
                class="product__img img-fluid"
            />
        </div>
        <div class="col product__contentwrap container">
            <div class="product__body row">
                <h1 class="product__title">${title}</h1>
                <p class="cards__creator card-subtitle">
                    <i class="far fa-user"></i>
                    <span>${creator}</span>
                </p>
                <p class="product__description">${description}</p>
            </div>
            <div class="product__footer row-sm-2 row-md-3"
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
                <div class="product__price">
                    <p class="product__pricelabel">Current Price</p>
                    <p class="product__price">$${price}</p>
                </div>
                <button
                    class="cards__favourite button__outlined"
                    aria-label="Save to favourites"
                    data-bs-tooltip="tooltip"
                    data-bs-trigger="hover"
                    data-bs-placement="bottom"
                    title="Save to favourites"
                >
                    <i class="far fa-heart"></i>
                </button>
                <button data-cards-btn-id="${id}" class="button__primary cards__cart add-to-cart">
                    <span class="fa-layers fa-fw">
                        <i class="far fa-shopping-cart"></i>
                        <span class="far fa-slash"></span>
                    </span>
                    <span class="cards__btntext">Add To Cart</span>
                </button>
            </div>
        </div>
    </div>`;
};
export default singleProduct();
