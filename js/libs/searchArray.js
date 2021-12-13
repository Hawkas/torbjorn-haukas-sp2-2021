import { apiPropertyKeys } from "./../settings.js";
import { equalizeString } from "./utilityFunctions.js";
const { itemKeyName, itemKeyAuthor } = apiPropertyKeys;

function filterArray(array, key, filterString) {
	let filteredArray = array.filter(function (object) {
		let propToCheck = equalizeString(object[`${key}`]);
		//* If the search-string doesn't contain periods, remove periods from the API-item's property.
		//* If search string includes period, filter using the period for more accurate result.
		if (!filterString.includes(".")) {
			propToCheck = propToCheck.split(".").join("");
		}
		return propToCheck.includes(filterString);
	});
	//* If array is empty, return false.
	if (filteredArray.length >= 1) {
		return filteredArray;
	} else {
		return false;
	}
}

function combineArrays(firstArray, secondArray) {
	let combinedArray = [];
	if (firstArray || secondArray) {
		//* If either arrays are empty, return the one that's not.
		if (firstArray && !secondArray) {
			combinedArray = firstArray;
		} else if (secondArray && !firstArray) {
			combinedArray = secondArray;
			//* Otherwise, we pluck out the duplicates from one array by checking their IDs, and combine the arrays
		} else {
			combinedArray = firstArray.filter(function (firstObject) {
				//* If any items from the second array exist in the first array, remove it
				let existsInArray = secondArray.find((secondObject) => parseInt(secondObject.id) === parseInt(firstObject.id));
				if (existsInArray) {
					return false;
				} else {
					return true;
				}
			});
			//* With all the duplicates gone, add all objects from the second array
			for (let object of secondArray) {
				combinedArray.push(object);
			}
		}
	}
	return combinedArray;
}

const searchArray = function (array, filterString) {
	let searchedArray = array;
	if (filterString !== "") {
		filterString = equalizeString(filterString);
		const firstKeyMatches = filterArray(array, itemKeyName, filterString);
		const secondKeyMatches = filterArray(array, itemKeyAuthor, filterString);
		searchedArray = combineArrays(firstKeyMatches, secondKeyMatches);
	}
	return searchedArray;
};

export default searchArray;
