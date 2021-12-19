import { adjustOffcanvas } from "./offcanvas.js";
import navBehavior from "./navBehavior.js";
import changeUserBtn from "./changeUserBtn.js";

const adjustInterface = function () {
	const footerBtn = document.querySelector(".footer__elevator");
	navBehavior(); //? Hide on scroll-down, add backdrop when dropdown is open, toggle. all that jazz.
	changeUserBtn(); //? Edit the user icon button to open the correct menu, and alter its appearance.
	footerBtn.onclick = () => {
		document.documentElement.scrollTop = 0;
	};
	//? Activate bootstraps Popper tooltips on elements with data-bs-tooltip="tooltip"
	let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'));
	let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		let tooltip = new bootstrap.Tooltip(tooltipTriggerEl);
		tooltip._config.fallbackPlacements = ["bottom"]; // So they don't overlap other elements
		tooltipTriggerEl.addEventListener("focusin", () => {
			let focusType = window.getComputedStyle(tooltipTriggerEl).getPropertyValue("outline");
			let actuallyFocused = "rgb(79, 250, 202) outset 3px";
			//^^ If my focus styling changes it wont show on focus. It won't change though.
			if (focusType === actuallyFocused) {
				tooltip.show();
			}
		});
		tooltipTriggerEl.addEventListener("focusout", () => tooltip.hide());
		return tooltip;
		//? Tooltips would freeze when focus is returned from offcanvas menu, and remain on screen.
		//? This felt very janky, and I couldn't programmatically remove it using tooltip.hide()..
		//? ..without removing the ability to show tooltips on focus entirely.
		//? I hardcoded it to only show on keyboard focus as I couldn't figure it out.
	});
	adjustOffcanvas();
};

export default adjustInterface;
