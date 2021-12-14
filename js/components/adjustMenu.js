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

const adjustMenu = function () {
	const hamburger = document.querySelector(".hamburger");
	const menuDivider = document.querySelector(".navigation__divider");
	const fullNav = document.querySelector(".navigation");
	hamburger.addEventListener("click", function () {
		this.classList.toggle("is-active");
		menuDivider.classList.toggle("is-active");
		fullNav.classList.toggle("is-active");
	});
	let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'));
	let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl);
	});
};

export default adjustMenu;
