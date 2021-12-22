import { getUser } from "./storageHelper.js";

if (getUser("jwt") === null) {
	window.location.href = "./index.html";
}
