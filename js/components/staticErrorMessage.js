const cardsContainer = document.querySelector(".cards__grid");

export const noResults = function () {
	cardsContainer.innerHTML = `
        <div class="col flex-fill">
            <h3 class="alert alert-secondary">No results found</h3>
        </div>`;
};

export const noFavourites = function () {
	cardsContainer.innerHTML = `
		<div class="col flex-fill">
			<h3 class="alert alert-primary">You don't have any favourites :(</h3>
		</div>`;
};

export const apiError = function () {
	cardsContainer.innerHTML = `
        <div class="col flex-fill">
            <h3 class="alert alert-danger">An error occured while loading the API</h3>
        </div>`;
};

export const emptyApi = function () {
	cardsContainer.innerHTML = `
        <div class="col flex-fill">
            <h3 class="alert alert-info">It seems the API's ran out of products. Why would you delete all the products?</h3>
        </div>`;
};
