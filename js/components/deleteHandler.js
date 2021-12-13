import fetchData from "../libs/fetchData.js";
import { BASE_URL, headers } from "../settings.js";
import alert from "./alert.js";
import renderToHtml from "./renderToHtml.js";
import { favouriteCleanser } from "../libs/localStorageHelper.js";
import addSearchFunctionality from "./addSearchFunctionality.js";
import { emptyApi } from "./staticErrorMessage.js";

const deleteHandler = function () {
	const deleteButtons = document.querySelectorAll(".btn-delete");
	for (let button of deleteButtons) {
		button.addEventListener("click", async function () {
			const id = this.dataset.id;
			try {
				let response = await axios.delete(`${BASE_URL}/articles/${id}`, headers);
				favouriteCleanser({ id });
				setTimeout(async function () {
					let articlesArray = await fetchData(`${BASE_URL}/articles`);
					try {
						renderToHtml(articlesArray);
					} catch (error) {
						console.log(error);
						emptyApi();
					}

					addSearchFunctionality(articlesArray);
					alert("alert-success", "Article successfully deleted :)");
				}, 200);
			} catch (error) {
				console.log(error);
				alert("alert-danger", "There was an error deleting your article. Try again later");
			}
		});
	}
};
export default deleteHandler;