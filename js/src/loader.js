/* global $*/

/**
*	Constructs a Loader object that represents the loader
*	@param {Object} options An object containing the following properties
*	@property {String} DOMId The DOM node id of the panel containing the loader panel
*	@property {String} titleClass The DOM node class of the loader panel
*/
function Loader(options) {

	const _defaultOptions = {
		DOMId: "#modal-loader",
		titleClass: ".loader-title",
	};

	this.options = $.extend(true, {}, _defaultOptions, options);

}

/**
*	Sets the title shown on the loader panel
*	@param {String} text The loader title panel
*	@access public
*/
Loader.prototype.setTitle = function (title) {

	$(`${this.options.DOMId} ${this.options.titleClass}`).html(title);

};

/**
*	Shows the loader panel
*	@access public
*/
Loader.prototype.show = function () {

	$(this.options.DOMId).show();

};

/**
*	Hides the loader panel
*	@access public
*/
Loader.prototype.hide = function () {

	$(this.options.DOMId).hide();

};
