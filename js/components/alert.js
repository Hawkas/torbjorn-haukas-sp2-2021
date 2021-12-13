export default function alert(cssClass, errorMessage, element = document.querySelector(".alert")) {
	element.innerHTML = `<div class="alert  ${cssClass}">
    ${errorMessage}
  </div>`;

	setTimeout(() => {
		element.innerHTML = "";
	}, 3000);
}
