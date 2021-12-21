export const initializeTooltips = function () {
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
	});
};
