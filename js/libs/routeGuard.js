import { getUser } from "./localStorageHelper.js";

if (getUser("jwt") === null) {
	window.location.href = "./login.html";
}
