import { BASE_URL, headers } from "../../settings.js";
import alert from "../alert.js";
import renderToHtml from "../renderToHtml.js";
import {
	localAddOrRemove,
	localStorageParse,
	sessionCleanser,
	sessionStorageParse,
	storageCleanser,
} from "../../libs/storageHelper.js";
import addSearchFunctionality from "../addSearchFunctionality.js";
import { emptyApi } from "../staticErrorMessage.js";
import dataCache from "../../libs/api-functions/dataCache.js";

const deleteHandler = function () {
	const deleteButtons = document.querySelectorAll(".cards__delete");
	for (let button of deleteButtons) {
		button.addEventListener("click", async function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (confirm("Are you really gonna permanently delete this NFT?")) {
				const entryToDelete = this.dataset.delete;
				const sessionObject = sessionStorageParse({ id: entryToDelete }, "strapi-data");
				const imageToDelete = sessionObject.image_media._id;
				try {
					const [firstResponse, secondResponse] = await Promise.all([
						axios.delete(`${BASE_URL}/upload/files/${imageToDelete}`, headers),
						axios.delete(`${BASE_URL}/products/${entryToDelete}`, headers),
					]);

					console.log(firstResponse);
					console.log(secondResponse);
					if (localStorageParse({ id: entryToDelete }, "favourites") !== undefined) {
						localAddOrRemove({ id: entryToDelete }, "favourites");
					}
					storageCleanser({ id: entryToDelete });
					sessionCleanser({ id: entryToDelete });

					setTimeout(async () => {
						let productsArray = await dataCache();
						try {
							renderToHtml(productsArray, { dashboardBoolean: true });
						} catch (error) {
							console.log(error);
							emptyApi();
						}
						addSearchFunctionality(productsArray, { dashboardBoolean: true });
						alert("alert-success", "Article successfully deleted :)", document.querySelector(".alert--cards"));
					}, 500);
				} catch (error) {
					console.log(error);
					alert(
						"alert-danger",
						"There was an error deleting your article. Try again later",
						document.querySelector(".alert--cards")
					);
				}
			}
		});
	}
};
export default deleteHandler;
