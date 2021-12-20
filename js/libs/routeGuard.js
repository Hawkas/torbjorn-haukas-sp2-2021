import { getUser } from "./localStorageHelper.js";

if (getUser("jwt") === null) {
	window.location.href = "./index.html";
}
