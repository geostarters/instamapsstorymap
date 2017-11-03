/** 
*	Class that groups utility functions
*	@exports Utils
*/
const Utils = {

	/**
	*	Checks if the provided url is a correct-encoded URL
	*	@param {string} url The url to check
	*	@returns {boolean} A boolean telling if the url is valid
	*	@instance
	*/
	isValidURL(url) {

		const expression = /(?:https?:\/\/)?(?:[\w]+\.)([a-zA-Z\.]{2,6})([\/\w\.-]*)*\/?/gi;
		const regex = new RegExp(expression);

		return regex.test(url);

	},

	/**
	*	Checks if the provided text is not empty
	*	@param {string} text The text to check
	*	@returns {boolean} A boolean telling if the text is emtpy
	*	@instance
	*/
	isNotEmpty(text) {

		return (text.trim() !== "");

	},

	/**
	*	Generates a random letter
	*	@returns {string} A string containing the letter generated
	*	@instance
	*/
	getRandomLetter() {

		return String.fromCharCode(65 + Math.floor(Math.random() * 26));

	},

	/**
	*	Generates a random identifier
	*	@returns {string} A string containing the identifier
	*	@instance
	*/
	getRandomId() {

		return Utils.getRandomLetter() + Date.now();

	},

	/**
	*	Adds the protocol to an URL if needed
	*	@returns {string} A string with a url containing a protocol
	*	@instance
	*/
	addProtocolIfNeeded(url) {

		let newURL = url;
		const expression = /(?:https?:\/\/)/gi;
		const regex = new RegExp(expression);

		if (!regex.test(url)) {

			newURL = `http://${newURL}`;

		}

		return newURL;

	},

};
