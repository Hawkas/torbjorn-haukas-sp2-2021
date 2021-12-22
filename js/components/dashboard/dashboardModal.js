import { validateWithFeedback } from "../../libs/formValidation.js";
import { BASE_URL, headers } from "../../settings.js";
import dataCache from "../../libs/api-functions/dataCache.js";
import alert from "../alert.js";
import renderToHtml from "../renderToHtml.js";
import addSearchFunctionality from "../addSearchFunctionality.js";
import { emptyApi } from "../staticErrorMessage.js";
import { getFromSession, sessionAddOrRemove, sessionStorageParse } from "../../libs/storageHelper.js";

const modal = document.querySelector(".modal");

const myModal = new bootstrap.Modal(document.querySelector("#staticBackdrop"), {
	keyboard: false,
});

const modalTitle = document.querySelector(".modal-title");
const inputTitle = document.querySelector("#title");
const inputCreator = document.querySelector("#creator");
const inputDescription = document.querySelector("#description");
const inputImage = document.querySelector("#image");
const inputPrice = document.querySelector("#price");
const inputFeatured = document.querySelector("#featured");

function clearInputs() {
	inputTitle.value = "";
	inputCreator.value = "";
	inputDescription.value = "";
	inputFeatured.checked = false;
}

let productsArray = await dataCache();
addSearchFunctionality(productsArray, { dashboardBoolean: true });
renderToHtml(productsArray, { dashboardBoolean: true });
function renderDashboard() {
	setTimeout(function () {
		myModal.hide();
		alert("alert-success", "Success!", document.querySelector(".alert--cards"));
	}, 100);
}

const dashboardModal = function () {
	modal.addEventListener("show.bs.modal", function (e) {
		//* Checks the button that invoked the modal, and acquires a dataset value from it
		const invokerButton = e.relatedTarget;
		const invokerRef = invokerButton.dataset.modal;
		const modalButton = document.querySelector(".btn__modal-submit");
		const modalAlert = document.querySelector(".alert-modal");
		clearInputs();
		//* If invoked by the 'create' button:
		if (invokerRef === "create") {
			//* Add title and button text
			modalTitle.innerHTML = "Create new artworks";
			modalButton.innerHTML = "Submit";
			//* Click event on button
			modalButton.onclick = async function () {
				try {
					const newProduct = await validateWithFeedback({
						inputTitle,
						inputCreator,
						inputDescription,
						inputImage,
						inputPrice,
						inputFeatured,
					});

					//? If the input values validate
					if (newProduct !== false) {
						const response = await axios.post(`${BASE_URL}/products`, newProduct, headers);
						console.log(response);
						sessionAddOrRemove(await response.data); // Great, now throw that into storage.
						//* Render the products again to reflect changes.
						renderDashboard();
						setTimeout(() => {
							renderToHtml(getFromSession("strapi-data"), { dashboardBoolean: true });
						}, 200);
					} else {
						//? But if the inputs don't validate, show this alert.
						alert("alert-danger", "Please fill all inputs", modalAlert);
					}
				} catch (error) {
					console.log(error);
					alert("alert-danger", "Couldn't create a new article. Try again or call a friend", modalAlert);
				}
			};
		} else if (invokerRef === "edit") {
			//* Get article ID from button's dataset
			let id = invokerButton.dataset.id;
			//* Fetch the article in its entirety from storage.
			const { title, creator, description, image_media, price, featured } = sessionStorageParse({ id }, "strapi-data");
			try {
				const oldImageUrl = image_media.formats.medium.url;
				modalTitle.innerHTML = `Editing "${title}"`;
				modalButton.innerHTML = "Save changes";
				inputTitle.value = title;
				inputCreator.value = creator;
				inputDescription.value = description;
				inputPrice.value = price;
				inputImage.value = oldImageUrl;
				if (featured === "true") inputFeatured.checked = true;
				modalButton.onclick = async function () {
					try {
						let sessionObject = sessionStorageParse({ id }, "strapi-data");
						let imageClone = inputImage;
						if (inputImage.value === oldImageUrl) {
							imageClone = false; // No need to upload the same image twice.
						}
						console.log(imageClone);
						const updatedArticle = await validateWithFeedback({
							inputTitle,
							inputCreator,
							inputDescription,
							inputPrice,
							inputImage: imageClone,
							inputFeatured,
						});
						if (updatedArticle !== false) {
							console.log(updatedArticle);
							const response = await axios.put(`${BASE_URL}/products/${id}`, updatedArticle, headers);
							console.log(response);
							sessionAddOrRemove(sessionObject, "strapi-data"); // Remove old object.
							sessionAddOrRemove(response.data, "strapi-data");
							renderDashboard(); // In with the new.
							if (response.status === 200) {
								setTimeout(() => {
									renderToHtml(getFromSession("strapi-data"), { dashboardBoolean: true });
								}, 500);
							}
						} else {
							alert("alert-danger", "Please fill all inputs", modalAlert);
						}
					} catch (error) {
						console.log(error);
						alert("alert-danger", "Failed to update article :(", modalAlert);
					}
				};
			} catch (error) {
				console.log(error);
				myModal.hide();
				alert(
					"alert-danger",
					"There was a problem fetching the article you chose. Please try again",
					document.querySelector("alert--cards")
				);
			}
		}
	});
};
export default dashboardModal;
