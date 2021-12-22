import alert from "../components/alert.js";
import { prepImageForUpload } from "./handleImages.js";
import { apiPropertyKeys } from "../settings.js";
const { itemKeyName, itemKeyAuthor, itemKeyContent, itemKeyPrice, itemKeyImage, itemKeyFeatured } = apiPropertyKeys;
export const checkInputLength = function (inputValue, requiredLength) {
	if (inputValue.length < requiredLength) {
		return false;
	} else {
		return true;
	}
};

export const testEmail = function (email) {
	const regexString =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regexString.test(email);
};

export const testPrice = function (price) {
	if (isNaN(parseInt(price))) {
		return false;
	}
	if (price < 1000) {
		return false;
	} else {
		return true;
	}
};

export const testUrl = function (string) {
	let url;

	try {
		url = new URL(string);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const validateWithFeedback = function (inputs = {}) {
	try {
		const modalAlert = document.querySelector(".alert-modal");
		const { inputTitle, inputCreator, inputDescription, inputPrice, inputImage = false, inputFeatured } = inputs;
		let titleCheck = checkInputLength(inputTitle.value.trim(), 3);
		let authorCheck = checkInputLength(inputCreator.value.trim(), 2);
		let descriptionCheck = checkInputLength(inputDescription.value.trim(), 3);
		let priceCheck = testPrice(inputPrice.value);
		let imageCheck = true;
		if (inputImage) {
			imageCheck = testUrl(inputImage.value.trim());
		}
		let featuredCheck = inputFeatured.checked ? "true" : "false";
		if (titleCheck && authorCheck && descriptionCheck && imageCheck && priceCheck) {
			try {
				async function pleaseWork() {
					let data = {
						[`${itemKeyName}`]: inputTitle.value.trim(),
						[`${itemKeyAuthor}`]: inputCreator.value.trim(),
						[`${itemKeyContent}`]: inputDescription.value.trim(),
						[`${itemKeyPrice}`]: inputPrice.value,
						[`${itemKeyFeatured}`]: featuredCheck,
					};
					if (inputImage) {
						let imageUrl = new URL(inputImage.value.trim());
						let formData = await prepImageForUpload(imageUrl.href, inputTitle.value.trim());
						formData.append("data", JSON.stringify(data));
						data = formData;
					}
					return data;
				}

				return pleaseWork();
			} catch (error) {
				console.error(error);
				throw error;
			}
		} else {
			console.log("failed validating");
			let alertHtml = "<ul>\n";
			if (!titleCheck) alertHtml += "<li>Invalid title string - must be at least 3 letters</li>\n";
			if (!authorCheck) alertHtml += "<li>Invalid creator string - must be at least 2 letters</li>\n";
			if (!descriptionCheck) alertHtml += "<li>Invalid description string - must be at least 25 letters</li>\n";
			if (!priceCheck) alertHtml += "<li>Invalid price - must be at least a 1000. We're not running a charity</li>\n";
			if (inputImage) {
				if (!imageCheck) alertHtml += "<li>Invalid image URL - must be a URL</li>\n";
			}

			alertHtml += "</ul>";
			alert("alert-danger", alertHtml, modalAlert);
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
};
