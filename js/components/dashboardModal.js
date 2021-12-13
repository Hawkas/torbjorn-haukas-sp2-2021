import { checkInputLength } from "../libs/formValidation.js";
import { BASE_URL, apiPropertyKeys, headers } from "../settings.js";
import fetchData from "../libs/fetchData.js";
import alert from "./alert.js";
import renderToHtml from "./renderToHtml.js";
import addSearchFunctionality from "./addSearchFunctionality.js";
import { emptyApi } from "./staticErrorMessage.js";

const { itemKeyName, itemKeyAuthor, itemKeyContent } = apiPropertyKeys;
const modal = document.querySelector(".modal");

//! I'm using bootstrap's modals here under the assumption that bootstrap is allowed in its entirety. If it isn't I'm screwed, but it's only for the level 2 parts of the assignment, so I'll still pass.. I hope?

const myModal = new bootstrap.Modal(document.querySelector("#staticBackdrop"), {
	keyboard: false,
});

const modalTitle = document.querySelector(".modal-title");
const inputTitle = document.querySelector("#title");
const inputAuthor = document.querySelector("#author");
const inputSummary = document.querySelector("#summary");

function clearInputs() {
	inputTitle.value = "";
	inputAuthor.value = "";
	inputSummary.value = "";
}

function validatePayload(title, author, summary) {
	let titleCheck = checkInputLength(title.value, 1);
	let authorCheck = checkInputLength(author.value, 1);
	let summaryCheck = checkInputLength(summary.value, 1);
	if (titleCheck && authorCheck && summaryCheck) {
		const articleObject = {
			[`${itemKeyName}`]: title.value,
			[`${itemKeyAuthor}`]: author.value,
			[`${itemKeyContent}`]: summary.value,
		};
		return articleObject;
	} else {
		return false;
	}
}
function renderDashboard() {
	setTimeout(async function () {
		let articlesArray = await fetchData(`${BASE_URL}/articles`);
		try {
			renderToHtml(articlesArray);
		} catch (error) {
			console.log(error);
			emptyApi();
		}
		addSearchFunctionality(articlesArray);
		myModal.hide();
		alert("alert-success", "Success!");
	}, 200);
}

const dashboardModal = function () {
	modal.addEventListener("show.bs.modal", async function (e) {
		//* Checks the button that invoked the modal, and acquires a dataset value from it
		const invokerButton = e.relatedTarget;
		const invokerRef = invokerButton.dataset.modal;
		const modalButton = document.querySelector(".btn__modal-submit");
		const modalAlert = document.querySelector(".alert-modal");
		clearInputs();
		//* If invoked by the 'create' button:
		if (invokerRef === "create") {
			//* Add title and button text
			modalTitle.innerHTML = "Create new article";
			modalButton.innerHTML = "Submit";
			//* Click event on button
			modalButton.onclick = async function () {
				try {
					const newArticle = validatePayload(inputTitle, inputAuthor, inputSummary);
					//* If the input values validate
					if (newArticle !== false) {
						const response = await axios.post(`${BASE_URL}/articles`, newArticle, headers);
						// console.log(response);
						//* Render the articles again to reflect changes.
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
			try {
				//* Make a request for an article using the above ID
				const { title, author, summary } = await fetchData(`${BASE_URL}/articles/${id}`);
				modalTitle.innerHTML = `Editing "${title}"`;
				modalButton.innerHTML = "Save changes";
				inputTitle.value = title;
				inputAuthor.value = author;
				inputSummary.value = summary;

				modalButton.onclick = async function () {
					try {
						const updatedArticle = validatePayload(inputTitle, inputAuthor, inputSummary);
						if (updatedArticle !== false) {
							const response = await axios.put(`${BASE_URL}/articles/${id}`, updatedArticle, headers);
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
				alert("alert-danger", "There was a problem fetching the article you chose. Please try again");
			}
		}
	});
};
export default dashboardModal;
