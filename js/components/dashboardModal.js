import { checkInputLength, testUrl, validateWithFeedback } from "../libs/formValidation.js";
import { BASE_URL, apiPropertyKeys, headers } from "../settings.js";
import fetchData from "../libs/api-functions/fetchData.js";
import alert from "./alert.js";
import renderToHtml from "./renderToHtml.js";
import addSearchFunctionality from "./addSearchFunctionality.js";
import { emptyApi } from "./staticErrorMessage.js";
import { sessionAddOrRemove, sessionStorageParse } from "../libs/storageHelper.js";

const { itemKeyName, itemKeyAuthor, itemKeyContent, itemKeyPrice, itemKeyImage, itemKeyFeatured } = apiPropertyKeys;
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

function validatePayload(title, author, description, image, price, featured) {
	let titleCheck = checkInputLength(title.value, 1);
	let authorCheck = checkInputLength(author.value, 1);
	let descriptionCheck = checkInputLength(description.value, 1);
	let priceCheck = testPrice(price);
	let imageCheck = testUrl(image);
	let featuredCheck = featured.checked ? "true" : "false";
	if (titleCheck && authorCheck && descriptionCheck && imageCheck && priceCheck) {
		const articleObject = {
			[`${itemKeyName}`]: title.value,
			[`${itemKeyAuthor}`]: author.value,
			[`${itemKeyContent}`]: description.value,
			[`${itemKeyPrice}`]: price.value,
			[`${itemKeyFeatured}`]: featuredCheck,
		};
		return articleObject;
	} else {
		return false;
	}
}
function renderDashboard() {
	setTimeout(async function () {
		let productsArray = await fetchData(`${BASE_URL}/products`);
		try {
			renderToHtml(productsArray, { dashboardBoolean: true });
		} catch (error) {
			console.log(error);
			emptyApi();
		}
		addSearchFunctionality(productsArray);
		myModal.hide();
		alert("alert-success", "Success!", document.querySelector(".alert--cards"));
	}, 200);
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
					//* If the input values validate
					console.log(newProduct);
					if (newProduct !== false) {
						const response = await axios.post(`${BASE_URL}/products`, newProduct, headers);
						console.log(response);
						sessionAddOrRemove(response.data);
						//* Render the products again to reflect changes.
						renderDashboard();
					} else {
						//* But if the inputs don't validate, show this alert.
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
				modalTitle.innerHTML = `Editing "${title}"`;
				modalButton.innerHTML = "Save changes";
				inputTitle.value = title;
				inputCreator.value = creator;
				inputDescription.value = description;
				inputPrice.value = price;
				inputImage.value = image_media[0].formats.medium.url;
				if (featured === "true") inputFeatured.checked = true;
				modalButton.onclick = async function () {
					try {
						let sessionObject = sessionStorageParse({ id }, "strapi-data");
						let imageClone = inputImage;
						if (inputImage.value === image.url) {
							imageClone = false; // No need to upload the same image twice.
						}
						const updatedArticle = validateWithFeedback({
							inputTitle,
							inputCreator,
							inputDescription,
							inputPrice,
							inputImage: imageClone,
							inputFeatured,
						});
						if (updatedArticle !== false) {
							const response = await axios.put(`${BASE_URL}/products/${id}`, updatedArticle, headers);
							console.log(response);
							sessionAddOrRemove(sessionObject, "strapi-data");
							sessionAddOrRemove(response.data, "strapi-data");
							renderDashboard();
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
