/* global $, _, Utils*/

function Dialog(options) {

	const _defaultOptions = {
		templateId: "#dialog_template",
		messageTextId: "#msg",
		showCancelButton: true,
		cancelButtonClass: ".btn-ko",
		confirmButtonClass: ".btn-ok",
		closeButtonClass: ".close",
	};

	this.options = $.extend(true, {}, _defaultOptions, options);

	this.setupDialog();
	this.addEvents();

}

Dialog.prototype.setupDialog = function () {

	const id = Utils.getRandomId();
	this.id = `#${id}`;

	this.template = _.template($(this.options.templateId).html().trim());
	$("body").append(this.template({ id }));

	if (!this.options.showCancelButton) {

		$(`${this.id} ${this.cancelButtonClass}`).hide();

	}

};

Dialog.prototype.addEvents = function () {

	const self = this;

	$(`${self.id} ${self.options.confirmButtonClass}`).on("click", () => {

		self.hide();
		$(self).trigger("Dialog:accept");

	});

	$(`${self.id} ${self.options.closeButtonClass}`).on("click", () => {

		self.hide();
		$(self).trigger("Dialog:cancel");

	});

	$(`${self.id} ${self.options.cancelButtonClass}`).on("click", () => {

		self.hide();
		$(self).trigger("Dialog:cancel");

	});

};

Dialog.prototype.setMessage = function (msg) {

	$(`${this.id} ${this.options.messageTextId}`).html(`<span>${msg}</span>`);

};

Dialog.prototype.show = function () {

	$(this.id).show();

};

Dialog.prototype.hide = function () {

	$(this.id).hide();

};
