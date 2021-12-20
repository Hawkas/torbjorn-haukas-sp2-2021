//* I wanted to use sessionStorage as a compromise to minimize API load. Don't have time to implement :(

export const saveToStorage = function (keyName, object) {
	localStorage.setItem(keyName, JSON.stringify(object));
};

export const getFromStorage = function (keyName) {
	if (localStorage.getItem(keyName) !== null) {
		return JSON.parse(localStorage.getItem(keyName));
	} else return [];
};
export const saveToSession = function (keyName, object) {
	sessionStorage.setItem(keyName, JSON.stringify(object));
};
export const getFromSession = function (keyName) {
	if (sessionStorage.getItem(keyName) !== null) {
		return JSON.parse(sessionStorage.getItem(keyName));
	} else return [];
};
export const storageObjectParse = function (localStorageObject, keyName) {
	let storageArray = getFromStorage(keyName);
	return storageArray.find((object) => object.id === localStorageObject.id);
};
//* Add to storage if it doesn't exist already, else remove.
export const storageAddOrRemove = function (localStorageObject, keyName = "favourites") {
	let storageArray = getFromStorage(keyName);
	let isInStorage = storageObjectParse(localStorageObject, keyName);

	if (isInStorage === undefined) {
		storageArray.push(localStorageObject);
		saveToStorage(keyName, storageArray);
	} else {
		let removedElementArray = storageArray.filter((object) => object.id !== localStorageObject.id);
		saveToStorage(keyName, removedElementArray);
	}
};

//* Rather than build the array from data saved client-side, I filter the array fetched from the API so any changes done to the API will be reflected.
export const filterFromStorage = function (array, localStorageArray) {
	return array.filter(function (object) {
		//* If object exists in localstorage, return true. Otherwise, remove it
		let isInStorage = localStorageArray.find((storageObject) => storageObject.id === object.id);
		if (isInStorage) return true;
	});
};

//* To remove products from favourites when they are deleted from the API
export const storageCleanser = function (localStorageObject) {
	for (let keyName of ["favourites", "cart"]) {
		let localStorageArray = getFromStorage(keyName);
		let isInStorage = storageObjectParse(localStorageObject, keyName);
		if (isInStorage !== undefined) {
			let removedElementArray = localStorageArray.filter((object) => object.id !== localStorageObject.id);
			saveToStorage(keyName, removedElementArray);
		}
	}
};
export const sessionCleanser = function (storageObject) {
	let everything = getFromSession("everything");
	let isInStorage = everything.find((object) => object.id === storageObject.id);
	if (isInStorage !== undefined) {
		let removedElementArray = everything.filter((object) => object.id !== localStorageObject.id);
		saveToSession("everything", removedElementArray);
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

//* Create a localstorage object

export const createThenValidateStorage = function (datasetContainer, keyName = "favourites") {
	let localStorageObject = {
		id: datasetContainer.dataset.id,
		title: datasetContainer.dataset.title,
		creator: datasetContainer.dataset.creator,
		description: datasetContainer.dataset.desc,
		price: datasetContainer.dataset.price,
		image: {
			url: datasetContainer.dataset.imageUrl,
			alt: datasetContainer.dataset.imageAlt,
			height: datasetContainer.dataset.imageHeight,
			width: datasetContainer.dataset.imageWidth,
		},
	};
	storageAddOrRemove(localStorageObject, keyName);
};