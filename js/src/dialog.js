/* global $, _, Utils*/

/**
*	Constructs a generic dialog object
*	@param {Object} options An object containing the following properties
*	@property {String} templateId The DOM node id of the panel containing the dialog template
*	@property {String} messageTextId The DOM node id of the dialog message text
*	@property {String} showCancelButton A boolean telling if the cancel button must be shown
*	@property {String} cancelButtonClass The DOM node class of the cancel button
*	@property {String} confirmButtonClass The DOM node class of the confirm button
*	@property {String} closeButtonClass The DOM node class of the close button
*/
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

/**
*	Setups the dialog
*	@access private
*/
Dialog.prototype.setupDialog = function () {

	const id = Utils.getRandomId();
	this.id = `#${id}`;

	this.template = _.template($(this.options.templateId).html().trim());
	$("body").append(this.template({ id }));

	if (!this.options.showCancelButton) {

		$(`${this.id} ${this.cancelButtonClass}`).hide();

	}

};

/**
*	Adds the events the Dialog should respond to
*	@access private
*	@emits "Dialog:accept" when the accept button is pressed
*	@emits "Dialog:cancel" when the cancel or close buttons are pressed
*/
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

/**
*	Sets the message shown on the dialog panel
*	@param {String} msg The dialog message
*	@access public
*/
Dialog.prototype.setMessage = function (msg) {

	$(`${this.id} ${this.options.messageTextId}`).html(`<span>${msg}</span>`);

};

/**
*	Shows the dialog panel
*	@access public
*/
Dialog.prototype.show = function () {

	$(this.id).show();

};

/**
*	Hides the diagonal panel
*	@access public
*/
Dialog.prototype.hide = function () {

	$(this.id).hide();

};
