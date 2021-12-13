export const saveToStorage = function (keyName, object) {
	localStorage.setItem(keyName, JSON.stringify(object));
};

export const getFromStorage = function (keyName) {
	if (localStorage.getItem(keyName) !== null) {
		return JSON.parse(localStorage.getItem(keyName));
	} else return [];
};

export const favouriteHandler = function (localStorageObject) {
	let favourites = getFromStorage("favourites");
	let isInStorage = favourites.find((object) => parseInt(object.id) === parseInt(localStorageObject.id));

	if (isInStorage === undefined) {
		favourites.push(localStorageObject);
		saveToStorage("favourites", favourites);
	} else {
		let removedElementArray = favourites.filter((object) => parseInt(object.id) !== parseInt(localStorageObject.id));
		saveToStorage("favourites", removedElementArray);
	}
};

//* Rather than build the array from data saved client-side, I filter the array fetched from the API so any changes done to the API will be reflected.
export const filterFromFavourites = function (array, localStorageArray) {
	return array.filter(function (object) {
		//* If object exists in localstorage, return true. Otherwise, remove it
		let isInStorage = localStorageArray.find((storageObject) => parseInt(storageObject.id) === parseInt(object.id));
		if (isInStorage) return true;
	});
};

//* To remove articles from favourites when they are deleted from the API
export const favouriteCleanser = function (localStorageObject) {
	let favourites = getFromStorage("favourites");
	let isInStorage = favourites.find((object) => parseInt(object.id) === parseInt(localStorageObject.id));
	if (isInStorage !== undefined) {
		let removedElementArray = favourites.filter((object) => parseInt(object.id) !== parseInt(localStorageObject.id));
		saveToStorage("favourites", removedElementArray);
	}
};

export const removeKeyFromStorage = function (keyName) {
	if (localStorage.getItem(keyName) !== null) {
		localStorage.removeItem(keyName);
	}
};

export const getUser = function (userKey) {
	return JSON.parse(localStorage.getItem(userKey));
};
