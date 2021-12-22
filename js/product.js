import { addFavouriteButtonEvents, addCartButtonEvents } from "./components/card/cardConstructor.js";
import singleProduct from "./components/card/singleProduct.js";
import adjustInterface from "./components/navigation/adjustInterface.js";
import { addCartEvents } from "./components/offcanvas-menu/cart/buildCart.js";
import { initializeTooltips } from "./libs/initializeTooltips.js";

const productContainer = document.querySelector(".product__container");
productContainer.innerHTML = singleProduct;
adjustInterface();

try {
	const cartBtn = document.querySelector(".cards__cart");
	const favBtn = document.querySelector(".cards__favourite");
	addCartButtonEvents(cartBtn);
	addFavouriteButtonEvents(favBtn);
	initializeTooltips();
} catch (error) {
	console.error(error); // probably good if it's broken, it's a mess.
}
