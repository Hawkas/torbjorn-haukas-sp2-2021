//** Nav bars behavior relative to the rest of the page

const fullNav = document.querySelector(".navigation");
const navDropdown = document.querySelector(".navbar-collapse");
const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navDropdown, { toggle: false });
const menuBackdrop = document.createElement("div");
const body = document.body;
let lastScrollPos = window.pageYOffset;
const navBehavior = function () {
	menuBackdrop.classList.add("navigation-backdrop", "fade");
	menuBackdrop.cNavDropdown = bsCollapse;
	menuBackdrop.addEventListener("click", function () {
		this.cNavDropdown.hide();
	});

	navDropdown.addEventListener("show.bs.collapse", function () {
		body.appendChild(menuBackdrop);
		body.style.overflow = "hidden";
	});
	navDropdown.addEventListener("shown.bs.collapse", function () {
		menuBackdrop.classList.add("show");
	});
	navDropdown.addEventListener("hide.bs.collapse", function () {
		menuBackdrop.classList.remove("show");
	});
	navDropdown.addEventListener("hidden.bs.collapse", function () {
		body.style.removeProperty("overflow");
	});

	window.onscroll = function () {
		let currentScrollPos = window.pageYOffset;
		if (lastScrollPos < currentScrollPos) {
			fullNav.classList.add("scroll-down");
		} else {
			fullNav.classList.remove("scroll-down");
		}
		lastScrollPos = currentScrollPos;
	};
};

export default navBehavior;
