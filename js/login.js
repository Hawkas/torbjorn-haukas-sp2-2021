import { testEmail, checkInputLength } from "./libs/formValidation.js";
import { BASE_URL } from "./settings.js";
import alert from "./components/alert.js";

const form = document.querySelector(".signin__form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

form.addEventListener("submit", async function (e) {
	e.preventDefault();
	if (testEmail(email.value) && checkInputLength(password.value, 1)) {
		try {
			const response = await axios.post(`${BASE_URL}/auth/local`, {
				identifier: email.value,
				password: password.value,
			});
			localStorage.setItem("jwt", JSON.stringify(response.data.jwt));
			localStorage.setItem("user", JSON.stringify(response.data.user));
			window.location.href = "./dashboard.html";
		} catch (error) {
			alert("alert-danger", error);
		}
	} else {
		alert("alert-danger", "You need to enter proper values for the inputs >:(");
	}
});
