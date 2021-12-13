import { getUser } from "../libs/localStorageHelper.js";
import { signOut } from "../libs/utilityFunctions.js";

const adjustMenu = function () {
	const navbar = document.querySelector(".navbar-nav");
	let signOutBtn = {};
	if (getUser("jwt") !== null) {
		navbar.innerHTML += `
        <li class="nav-item ms-auto">
            <a class="nav-link btn btn-outline-danger sign-out" role="button" href="">Sign out</a>
        </li>`;
		signOutBtn = document.querySelector(".sign-out");
		signOutBtn.addEventListener("click", signOut);
	} else {
		navbar.innerHTML += `
        <li class="nav-item ms-auto"><a class="nav-link btn btn-outline-info" href="./login.html">Sign in</a></li>
        `;
	}
};
export default adjustMenu;
