import renderToHtml from "./components/renderToHtml.js";
import addSearchFunctionality from "./components/addSearchFunctionality.js";

import { apiError, emptyApi } from "./components/staticErrorMessage.js";
import adjustInterface from "./components/navigation/adjustInterface.js";
import dataCache from "./libs/api-functions/dataCache.js";

adjustInterface();
// function assignProductData() {
// 	let productCards = document.querySelectorAll(".cards__card");
// 	for (let card of productCards) {
// 		let dataFooter = card.lastElementChild;
// 		const id = dataFooter.dataset.id;
// 		const title = dataFooter.dataset.title;
// 		const creator = dataFooter.dataset.creator;
// 		const desc = dataFooter.dataset.desc;
// 		const price = dataFooter.dataset.price;
// 		const imageUrl = dataFooter.dataset.imageUrl;
// 		const imageId = dataFooter.dataset.imageId;
// 		const imageAlt = dataFooter.dataset.imageAlt;
// 		const imageHeight = dataFooter.dataset.imageHeight;
// 		const imageWidth = dataFooter.dataset.imageWidth;
// 		card.storedProduct = { id, title, creator, desc, price, imageUrl, imageId, imageAlt, imageHeight, imageWidth };
// 	}
// 	console.log(productCards[0].storedProduct);
// }

try {
	const productsArray = await dataCache();
	try {
		renderToHtml(productsArray);
		// Add functionality for search inputs and suggestions list
		addSearchFunctionality(productsArray);
		// Render all items in API call to DOM and add handlers
	} catch (error) {
		console.error(error);
		emptyApi(); // You dun goofed. The API is empty.
	}
} catch (error) {
	console.error(error);
	apiError();
}
