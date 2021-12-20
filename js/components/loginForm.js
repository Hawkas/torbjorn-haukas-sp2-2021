import { testEmail, checkInputLength } from "../libs/formValidation.js";
import { BASE_URL } from "../settings.js";
import alert from "./alert.js";
import { getUser } from "../libs/storageHelper.js";
import { toggleDisabled } from "../libs/utilityFunctions.js";

function submitBtnState(button, cacheBtn, success = false) {
	if (success) {
		button.classList.add("login-success");
		button.innerHTML = "&check; Success";
	} else {
		toggleDisabled(button);
		if (button.disabled) {
			button.innerHTML = `
			<span>
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
				Verifying...
			</span>`;
		} else {
			button.innerHTML = cacheBtn;
		}
	}
}
export const loginForm = function () {
	if (getUser("jwt") === null) {
		const form = document.querySelector(".offcanvas__form");
		const email = document.querySelector('[type="email"]');
		const password = document.querySelector('[type="password"]');
		const alertDiv = document.querySelector(".offcanvas__alert");
		const submitBtn = document.querySelector(".offcanvas__form .button__primary");
		// To toggle disable on inputs
		function toggleInputs(cacheBtn) {
			submitBtnState(submitBtn, cacheBtn);
			toggleDisabled(email, password);
		}

		form.addEventListener("submit", async function (e) {
			e.preventDefault();
			let cacheBtn = submitBtn.innerHTML;
			toggleInputs(cacheBtn);
			if (testEmail(email.value) && checkInputLength(password.value, 1)) {
				try {
					let response = await axios.post(`${BASE_URL}/auth/local/`, {
						identifier: email.value,
						password: password.value,
					});
					localStorage.setItem("jwt", JSON.stringify(response.data.jwt));
					localStorage.setItem("user", JSON.stringify(response.data.user));
					submitBtnState(submitBtn, cacheBtn, true);
					// Trigger a custom event on success
					this.dispatchEvent(new CustomEvent("loginSuccess"));
				} catch (error) {
					console.error(error);
					let statusCode = error.response.data.statusCode;
					let clientError = statusCode >= 400 && statusCode < 500;
					let serverError = statusCode >= 500;
					toggleInputs(cacheBtn);
					if (clientError) {
						alert("alert-danger", "Your credentials were incorrect", alertDiv);
					} else if (serverError) {
						alert("alert-danger", "Our API is having trouble, contact your local admin", alertDiv);
					} else {
						alert("alert-danger", "An unknown error has occured. Your guess is as good as mine, chief.", alertDiv);
					}
				}
			} else {
				toggleInputs(cacheBtn);
				alert("alert-danger", "You need to enter proper values for the inputs >:(", alertDiv);
			}
		});
	}
};
