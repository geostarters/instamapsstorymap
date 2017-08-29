/* global $*/

function Dialog(options) {

	const _defaultOptions = {
		slideDeletePopupTemplateId: "#dialog_delete_slide",
		slideDeleteMessageTextId: "#msg",
	};

	this.options = $.extend(true, {}, _defaultOptions, options);

	this.addEvents();

}

Dialog.prototype.addEvents = function () {

	const self = this;

	$(`${self.options.slideDeletePopupTemplateId} .btn-default`).on("click", () => {

		self.hide();
		$(self).trigger("Dialog:accept");

	});

	$(`${self.options.slideDeletePopupTemplateId} .close`).on("click", () => {

		self.hide();
		$(self).trigger("Dialog:cancel");

	});

	$(`${self.options.slideDeletePopupTemplateId} .btn-danger`).on("click", () => {

		self.hide();
		$(self).trigger("Dialog:cancel");

	});

};

Dialog.prototype.setMessage = function (msg) {

	$(this.options.slideDeleteMessageTextId).html(`<span>${msg}</span>`);

};

Dialog.prototype.show = function () {

	$(this.options.slideDeletePopupTemplateId).show();

};

Dialog.prototype.hide = function () {

	$(this.options.slideDeletePopupTemplateId).hide();

};
