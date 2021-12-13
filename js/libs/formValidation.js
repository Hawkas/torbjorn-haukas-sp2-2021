export const checkInputLength = function (inputValue, requiredLength) {
	if (inputValue.length < requiredLength) {
		return false;
	} else {
		return true;
	}
};

export const testEmail = function (email) {
	const regexString =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regexString.test(email);
};
