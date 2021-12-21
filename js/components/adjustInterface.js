import { adjustOffcanvas } from "./offcanvas.js";
import navBehavior from "./navBehavior.js";
import { changeCounter, changeUserBtn } from "./changeNavButtons.js";
import { initializeTooltips } from "../libs/initializeTooltips.js";

const adjustInterface = function () {
	const footerBtn = document.querySelector(".footer__elevator");

	//? Activate bootstraps Popper tooltips on elements with data-bs-tooltip="tooltip"
	initializeTooltips();
	adjustOffcanvas();
	navBehavior(); //? Add backdrop when dropdown is open, toggle. all that jazz.
	changeUserBtn(); //? Edit the user icon button to open the correct menu, and alter its appearance.
	changeCounter(); //? Update cart icon's counter.

	footerBtn.onclick = () => {
		document.documentElement.scrollTop = 0;
	};
};

export default adjustInterface;
