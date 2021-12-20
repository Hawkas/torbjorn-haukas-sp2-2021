import { headers } from "../settings.js";

export const deleteImage = async function (imageId) {
	let response = await axios.delete(`${BASE_URL}/upload/files/${imageId}`, headers);
	if (response.status === 200) {
		return true;
	}
};

export const uploadByUrl = async function (imageUrl, internalImageName) {
	let newImageId = "";
	try {
		const response = await axios.get(imageUrl, { responseType: "blob" });
		const mimeType = response.headers["content-type"];
		const imageFile = new File([response.data], internalImageName, { type: mimeType });
		const formData = new FormData();
		formData.append("files", imageFile);
		formData.append("refId", "");
		formData.append("ref", "products");
		formData.append("field", "image_media");
		let postResponse = await axios.post(`${BASE_URL}/upload`, formData, headers);
		newImageId = postResponse.data[0].id;

		//* This took me two hours to figure out. Strapi documentation is cryptic.
		//* Also learned you can convert blobs to files and just upload them directly. neato.
	} catch (error) {
		console.error(error);
		throw "That's clearly not an image Bob :)))";
	} finally {
		return newImageId;
	}
};
