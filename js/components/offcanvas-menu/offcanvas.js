import { loginForm } from "./user/loginForm.js";
import { canvasLogin, canvasLoggedIn } from "../../settings.js";
import { buildCart, addCartEvents } from "./cart/buildCart.js";
import { signOut } from "../../libs/utilities.js";

const myOffcanvas = document.querySelector(".offcanvas");
const canvasInner = document.querySelector(".offcanvas__inner");
const userButton = document.querySelector(".navigation__iconbtn--signin");
const bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);

function addLoginEvents() {
	loginForm();
	document.querySelector(".offcanvas__form").addEventListener("loginSuccess", function (e) {
		// Change appearance and data on user icon btn in nav by dispatching event.
		userButton.dispatchEvent(new CustomEvent("signedChange"));
		canvasTransition(canvasLoggedIn);
	});
}

function addLogoutEvents() {
	const signoutBtn = document.querySelector(".offcanvas__btn--signout");
	signoutBtn.addEventListener("click", logoutEvent);
}
function logoutEvent(e) {
	e.preventDefault();
	this.disabled = true;
	signOut();
	userButton.dispatchEvent(new CustomEvent("signedChange"));
	canvasTransition(canvasLogin);
}

function canvasTransition(newCanvas) {
	const fadeOutList = document.querySelectorAll(".offcanvas .animate__animated");
	for (let element of fadeOutList) {
		element.classList.add("animate__fadeOutRight");
	}
	setTimeout(() => {
		canvasInner.classList.toggle("hide");
	}, 600);
	setTimeout(() => {
		canvasInner.innerHTML = newCanvas(" animate__fadeInRight");
	}, 700);
	setTimeout(() => {
		canvasInner.classList.toggle("hide");
		if (newCanvas === canvasLogin) {
			addLoginEvents();
		} else {
			addLogoutEvents();
		}
	}, 1100);
}
function cartIsEmpty() {
	canvasInner.innerHTML = buildCart();
	addCartEvents();
}

export const adjustOffcanvas = function () {
	myOffcanvas.addEventListener("show.bs.offcanvas", function (e) {
		const invokerButton = e.relatedTarget;
		const invokerRef = invokerButton.dataset.canvas;

		if (invokerRef === "login") {
			canvasInner.innerHTML = canvasLogin();
			addLoginEvents();
		}
		if (invokerRef === "user") {
			canvasInner.innerHTML = canvasLoggedIn();
			addLogoutEvents();
		}
		if (invokerRef === "cart") {
			canvasInner.innerHTML = buildCart();
			addCartEvents();
			canvasInner.addEventListener("emptyCart", cartIsEmpty, { once: true });
		}
	});
};
