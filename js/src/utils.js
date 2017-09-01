/* exported Utils */
const Utils = {

	isValidURL(url) {

		const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/gi;
		const regex = new RegExp(expression);

		return regex.test(url);

	},

	isNotEmpty(text) {

		return (text.trim() !== "");

	},

	getRandomLetter() {

		return String.fromCharCode(65 + Math.floor(Math.random() * 26));

	},

	getRandomId() {

		return Utils.getRandomLetter() + Date.now();

	},

};
