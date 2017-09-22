/* global $*/

function Loader(options) {

	const _defaultOptions = {
		DOMId: "#modal-loader",
		titleClass: ".loader-title",
	};

	this.options = $.extend(true, {}, _defaultOptions, options);

}

Loader.prototype.setTitle = function (title) {

	$(`${this.options.DOMId} ${this.options.titleClass}`).html(title);

};

Loader.prototype.show = function () {

	$(this.options.DOMId).show();

};

Loader.prototype.hide = function () {

	$(this.options.DOMId).hide();

};
