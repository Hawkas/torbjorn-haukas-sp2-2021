//** Adjusting for direct interactions with the navigation contents, and conditional changes to buttons.
import { getUser, getFromStorage } from "../libs/storageHelper.js";

const userButton = document.querySelector(".navigation__iconbtn--signin");
const counter = document.querySelector(".navigation__counter");

function recountIt(e) {
	let counterInt = getFromStorage("cart").length;
	if (e) {
		counter.classList.toggle("changing");
		if (e.detail) {
			counter.innerHTML = parseInt(counterInt) + 1;
		}
		if (!e.detail) counter.innerHTML = `${parseInt(counterInt) - 1}`;
		setTimeout(() => {
			this.classList.toggle("changing");
		}, 500);
	} else {
		counterInt = getFromStorage("cart").length;
		counter.innerHTML = counterInt;
	}
}
export const changeCounter = function () {
	recountIt();
	counter.addEventListener("cartChange", recountIt);
};
export const changeUserBtn = function () {
	const userIcons = document.querySelectorAll(".navigation__iconbtn--signin .fa-layers");
	let userCheck = !(getUser("jwt") === null);
	let newTitle = userCheck ? "Open account navigation" : "Sign in";
	const tooltip = bootstrap.Tooltip.getOrCreateInstance(userButton);

	userButton.dataset.canvas = userCheck ? "user" : "login";
	userButton.title = newTitle;
	tooltip._config.title = newTitle;

	for (let icon of userIcons) {
		if (icon.classList.contains("no-user")) {
			//? Using two icons rather than changing FA class
			//? That way it doesn't flash due to the delay from FA's rendering procedure.
			icon.classList[`${userCheck ? "add" : "remove"}`]("hide");
		} else {
			icon.classList[`${userCheck ? "remove" : "add"}`]("hide");
		}
	}
};
const determineUserBtnState = function () {
	changeUserBtn();
	userButton.addEventListener("signedChange", changeUserBtn);
	window.onstorage = changeUserBtn(); // Supposedly only works on 'other' pages on the domain.. but it invokes when something is removed?

	//* We do it live as, just using custom events rather than reloading
};
