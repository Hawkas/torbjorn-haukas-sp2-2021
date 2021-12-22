import { getFromLocal, removeKeyFromStorage, localAddOrRemove } from "../../../libs/storageHelper.js";

function reCalcTotal(e) {
	const deductAmount = e.detail.change;
	let current = parseInt(this.innerHTML.slice(1));
	let newValue = current - deductAmount;
	console.log(newValue);
	this.innerHTML = `$${newValue}`;
	if (newValue < 1 || isNaN(newValue)) {
		setTimeout(() => {
			this.dispatchEvent(new CustomEvent("emptyCart", { bubbles: true }));
		}, 200);

		// I'm just bubbling this up to the top to remake the cart
		// Timeout to give time for session storage to clear.
	}
}
export const addCartEvents = function () {
	if (document.querySelector(".navigation__iconbtn--cart")) {
		if (getFromLocal("cart").length >= 1) {
			const totalPrice = document.querySelector(".cart__total");
			const removeBtns = document.querySelectorAll(".cart__trash");

			totalPrice.addEventListener("priceChange", reCalcTotal); // Custom event for price change.

			for (let button of removeBtns) {
				button.addEventListener("click", function (e) {
					//* Send price value to deduct out to listener
					let price = this.dataset.price;
					totalPrice.dispatchEvent(
						new CustomEvent("priceChange", {
							detail: {
								change: parseInt(price),
							},
						})
					);
					//* Find and remove product from rendered cart and localStorage, using id.
					let productId = this.dataset.id;
					let productToRemove = document.querySelector(`[data-cart-id="${productId}"`);
					const cardBtn = document.querySelector(`[data-cards-btn-id="${productId}"]`);
					if (cardBtn) {
						cardBtn.dispatchEvent(new CustomEvent("tossFromCart"));
						//* ^^This event will purge from localstorage and alter button state.
						//? Ideally I want to remove from the same place that added it.
					} else {
						//? Unless the button on the cards is gone, i.e the dashboard.
						localAddOrRemove({ id: productId }, "cart");
					}

					setTimeout(() => {
						if (productToRemove.parentNode) {
							productToRemove.parentNode.removeChild(productToRemove);
						}
					}, 200);
				});
			}
		}
	}
};
export const buildCart = function () {
	let cartHtml = `
                <header class="offcanvas-header">
					<button type="button" class="offcanvas__close text-reset" data-bs-dismiss="offcanvas" aria-label="Close">
						<i class="far fa-times"></i>
					</button>
					<div class="offcanvas__icon">
						<i class="fal fa-shopping-cart"></i>
					</div>
					<h2 class="offcanvas-title" id="offcanvasLabel">Cart</h2>
				</header>`;

	let cartProducts = getFromLocal("cart");
	if (cartProducts.length >= 1) {
		let cartTotal = 0;
		cartHtml += `<div class="offcanvas-body">
                        <ul class="cart list-group list-group-flush scrollarea">`;
		for (let product of cartProducts) {
			const { title, id, price, image } = product;
			cartTotal += parseInt(price);
			cartHtml += `<li class="cart__product" data-cart-id="${id}">
						<div class="cart__product-inner d-flex w-100 align-items-center justify-flex-start">
							<div class="cart__imgwrap">
								<img
									class="cart__img"
									src="${image.url}"
									alt="${image.alt}"
									width="${image.width}"
									height="${image.height}"
								/>
							</div>
							<div class="cart__info d-flex align-items-center justify-flex-start">
								<div class="cart__text">
									<h3 class="cart__title mb-1 text-truncate">${title}</h3>
									<small class="mb-1">$${price}</small>
								</div>
								<button  
                                data-id="${id}"
                                data-price="${price}"
                                class="cart__trash"><i class="far fa-trash-alt"></i></button>
							</div>
						</div>
					</li>`;
		}

		cartHtml += `
        </ul>
                <div class="pt-4 mt-5 d-flex justify-content-between w-100 align-items-center cart__subtotal">
                    <strong>Subtotal</strong>
                    <p class="cart__total">$${cartTotal}</p>
                </div>
            </div>`;
	} else {
		cartHtml += `
        <div class="offcanvas-body">
            <div class="alert alert-primary">
                <strong>Your cart is empty :(</strong>
            </div>
        </div>`;
	}
	return cartHtml;
};
