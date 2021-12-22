function assignProductData() {
	let productCards = document.querySelectorAll(".cards__card");
	for (let card of productCards) {
		card.productData = {};
		let dataFooter = card.lastElementChild;
		card.productData.id = dataFooter.dataset.id;
		card.productData.title = dataFooter.dataset.title;
		card.productData.creator = dataFooter.dataset.creator;
		card.productData.desc = dataFooter.dataset.desc;
		card.productData.price = dataFooter.dataset.price;
		card.productData.image.url = dataFooter.dataset.imageUrl;
		card.productData.image.id = dataFooter.dataset.imageId;
		card.productData.image.alt = dataFooter.dataset.imageAlt;
		card.productData.image.height = dataFooter.dataset.imageHeight;
		card.productData.image.width = dataFooter.dataset.imageWidth;
	}
	console.log(productCards[0].productData);
}

assignProductData();
