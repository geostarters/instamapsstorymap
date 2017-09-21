/* exported Utils */
const Utils = {

	isValidURL(url) {

		const expression = /(?:https?:\/\/)?(?:[\w]+\.)([a-zA-Z\.]{2,6})([\/\w\.-]*)*\/?/gi;
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
