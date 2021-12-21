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
		formData.append(`files${"image_media"}`, imageFile, imageFile.name);
		formData.append("refId", "");
		formData.append("ref", "products");
		formData.append("field", "image_media");
		let postResponse = await axios.post(`${BASE_URL}/upload`, formData, headers);
		newImageId = postResponse.data[0].id;
	} catch (error) {
		console.error(error);
		throw "That's clearly not an image Bob :)))";
	} finally {
		return newImageId;
	}
};
export async function prepImageForUpload(imageUrl, internalImageName) {
	//* This is overkill I figure, and I did spend hours trying to figure this out.
	//* I'd rather not have my page link to external URLs is all.
	try {
		const response = await axios.get(imageUrl, { responseType: "blob" });
		const mimeType = response.headers["content-type"];
		const imageFile = new File([response.data], internalImageName, { type: mimeType });
		const formData = new FormData();
		formData.append(`files.${"image_media"}`, imageFile, imageFile.name);
		return formData;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
