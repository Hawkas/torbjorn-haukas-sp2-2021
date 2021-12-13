//? Object Property Key strings from API

//! Rather than hardcoding these values, I'm just gonna add them here so the code is reusable later on by editing the strings to fit the API being used.

//* I will only be adding property keys I want to access in the api.

const itemKeyName = "title";
const itemKeyAuthor = "creator";
const itemKeyContent = "description";
// const itemKeyPublished = "";
// const itemKeyCategory = "";
const itemKeyPrice = "price";

export const apiPropertyKeys = { itemKeyName, itemKeyAuthor, itemKeyContent, itemKeyPrice };

export const BASE_URL = "https://ethereal-strapi.herokuapp.com";

export const headers = {
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${JSON.parse(localStorage.getItem("jwt"))}`,
	},
};
