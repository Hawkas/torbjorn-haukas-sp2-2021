//? Object Property Key strings from API

//! Rather than hardcoding these values, I'm just gonna add them here so the code is reusable later on by editing the strings to fit the API being used.

//* I will only be adding top-level property keys I want to access in the api.

const itemKeyName = "title";
const itemKeyAuthor = "creator";
const itemKeyContent = "description";
const itemKeyFeatured = "featured";
const itemKeyImage = "image__media";
const itemKeyPrice = "price";

export const apiPropertyKeys = { itemKeyName, itemKeyAuthor, itemKeyContent, itemKeyPrice, itemKeyImage, itemKeyFeatured };

export const BASE_URL = "https://ethereal-strapi.herokuapp.com";

export const headers = {
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${JSON.parse(localStorage.getItem("jwt"))}`,
	},
};

export const canvasLogin = function (fadeIn = "") {
	return `
	<header class="offcanvas-header">
		<button type="button" class="offcanvas__close text-reset" data-bs-dismiss="offcanvas" aria-label="Close">
			<i class="far fa-times"></i>
		</button>
		<div class="offcanvas__icon animate__animated animate__faster${fadeIn}">
			<i class="fal fa-user"></i>
		</div>
		<h2 class="offcanvas-title animate__animated animate__faster${fadeIn}" id="offcanvasLabel">Sign in</h2>
	</header>
	<div class="offcanvas-body">
		<div class="mt-5 container">
			<div class="col-sm-12 offcanvas__alert"></div>
			<form class="mt-3 offcanvas__form animate__animated animate__faster${fadeIn}">
				<div class="offcanvas__inputwrap form-floating">
					<input type="email" class="form-control" id="floatingEmail" placeholder="name@example.com" />
					<label for="floatingInput">Email address</label>
				</div>
				<div class="offcanvas__inputwrap form-floating">
					<input type="password" autocomplete="current-password" class="form-control" id="floatingPassword" placeholder="Password" />
					<label for="floatingPassword">Password</label>
				</div>
				<button class="w-100 mt-4 button__primary" type="submit"><span>Sign in</span></button>
			</form>
		</div>
	</div>`;
};
export const canvasLoggedIn = function (fadeIn = "") {
	return `
	<header class="offcanvas-header">
		<button type="button" class="offcanvas__close text-reset" data-bs-dismiss="offcanvas" aria-label="Close">
			<i class="far fa-times"></i>
		</button>
		<div class="offcanvas__icon animate__animated animate__faster${fadeIn}">
			<i class="fal fa-user-crown"></i>
		</div>
		<h2 class="offcanvas-title animate__animated animate__faster${fadeIn}" id="offcanvasLabel">Hey teacher</h2>
	</header>
	<div class="position-relative offcanvas-body animate__animated animate__faster${fadeIn}">
		<nav class="position-absolute container offcanvas__signed-in">
			<ul class="navbar-nav me-auto offcanvas__navlist">
				<li class="nav-item offcanvas__item">
					<a href="./dashboard.html" class="offcanvas__btn">
						<span>Admin stuff</span><i class="fal fa-cogs fa-fw"></i>
					</a>
				</li>
				<li class="nav-item offcanvas__item">
					<button class="offcanvas__btn offcanvas__btn--signout">
						<span>Sign out</span><i class="fal fa-sign-out fa-fw"></i>
					</button>
				</li>
			</ul>
		</nav>
	</div>`;
};
export const dashboardToast = `
			<div class="toast border-0 rounded-0 text-white" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
				<div class="toast-header rounded-0">
					<p class="text-uppercase">A quick headsup</p>
					<button class="ms-auto" type="button" data-bs-dismiss="toast" aria-label="Close">
						<i class="text-white fal fa-times"></i>
					</button>
				</div>
					<div class="toast-body">
						<p>You should know that my API is not ephemeral. I set it up with a free BaaS, so if you delete a 'product' in there, it'll be gone for good.</p>
						<p>Backups are a paid service soo..</p>
						<p>Please create a new product before deleting something</p>
						<br/>
						<p>Cheers<p>
					</div>
					
			</div>`;
