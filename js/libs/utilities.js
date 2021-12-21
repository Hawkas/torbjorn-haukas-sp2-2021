// This function will ensure any double spaces or more are reduced to a single space instead.
export const equalizeString = function (str) {
	while (str.indexOf("\t") > -1) {
		str = str.replace("\t", " ");
	}
	while (str.indexOf("  ") > -1) {
		str = str.replace("  ", " ");
	}
	return str.trim().toLowerCase();
};

export const arrowKeyNavigation = function (e, element, parentContainer, input) {
	if (e.keyCode === 38 || e.keyCode === 40) {
		let index = parseInt(element.dataset.index);
		if (e.keyCode === 38) {
			// Up arrow
			if (index !== 0) {
				// Move up within list if index is not at 0
				parentContainer[index - 1].focus();
			} else {
				// Move back up to input if index is 0
				input.focus();
			}
		}
		if (e.keyCode === 40) {
			// Down arrow
			if (index !== parentContainer.length - 1) {
				// If index is not the last item in list, move down.
				parentContainer[index + 1].focus();
			} else {
				// Otherwise, just go back to the first
				parentContainer[0].focus();
			}
		}
	} else if (e.keyCode === 13) {
		// If enter is pressed, invoke click event
		element.click();
	}
};


export const signOut = function () {
	localStorage.removeItem("user");
	localStorage.removeItem("jwt");
	console.log(window.location.href);
};

export const toggleDisabled = function () {
	for (let element of arguments) {
		element.disabled = !element.disabled; // if false, set to true and vice versa.
	}
};
