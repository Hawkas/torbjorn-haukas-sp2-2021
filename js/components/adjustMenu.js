// import { getUser } from "../libs/localStorageHelper.js";
// import { signOut } from "../libs/utilityFunctions.js";

// const adjustMenu = function () {
// 	const navbar = document.querySelector(".navigation__right");
// 	let signOutBtn = {};
// 	if (getUser("jwt") !== null) {
// 		navbar.innerHTML += `
//         <div class="nav-item ms-auto">
//             <a class="btn btn-outline-danger btn-sm sign-out" role="button" href="">Sign out</a>
//         </div>`;
// 		signOutBtn = document.querySelector(".sign-out");
// 		signOutBtn.addEventListener("click", signOut);
// 	} else {
// 		navbar.innerHTML += `
//         <div class="nav-item ms-auto">
// 			<a class="btn btn-outline-primary btn-sm" href="./login.html">Sign in</a>
// 		</div>
//         `;
// 	}
// };
// export default adjustMenu;

//? Add or remove border styling on menu
function toggleBorders(elArray, add = false) {
	if (add) {
		for (let element of elArray) {
			element.classList.add("is-active");
		}
	} else {
		for (let element of elArray) {
			element.classList.remove("is-active");
		}
	}
}
const adjustMenu = function () {
	const hamburger = document.querySelector(".hamburger");
	const fullNav = document.querySelector(".navigation");
	const offcanvas = document.querySelector("#offcanvas");
	//? Collapse is using bootstrap timings, I've adapted my code to follow its whims
	hamburger.addEventListener("click", function () {
		let collapseCheck = this.classList.contains("collapsed");

		//! If event fires and class is NOT present, menu is expanding.
		if (!collapseCheck) {
			// add my styling classes
			toggleBorders([fullNav], "add");
		}
		//! If event fires and the class is present, menu is collapsing.
		else {
			// remove my styling classes
			toggleBorders([fullNav]);
		}
	});

	//? Activate bootstraps Popper tooltips on elements with data-bs-tooltip="tooltip"
	let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		let tooltip = new bootstrap.Tooltip(tooltipTriggerEl);
		tooltipTriggerEl.addEventListener("focusin", () => tooltip.show());
		tooltipTriggerEl.addEventListener("focusout", () => tooltip.hide());
		tooltipTriggerEl.firstChild.addEventListener("hidden.bs.offcanvas", () => tooltip.disable());

		return tooltip;
	});
	console.log(tooltipList);
};

export default adjustMenu;
