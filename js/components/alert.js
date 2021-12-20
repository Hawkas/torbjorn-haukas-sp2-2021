export default function alert(cssClass, errorMessage, element = document.querySelector(".alert--card")) {
	element.innerHTML = `<div class="alert  ${cssClass}">
    ${errorMessage}
  </div>`;

	setTimeout(() => {
		element.innerHTML = "";
	}, 5000);
}
