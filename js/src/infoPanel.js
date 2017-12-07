/* global Utils, $*/

/**
*	Constructs a InfoPanel object that represents the slide info panel
*	@param {Object} options An object containing the following properties
*	@property {String} panelId The DOM node id of the panel containing the info panel
*	@property {String} urlInputId The DOM node id of the input where the url is written to
*	@property {String} urlLoadButtonId The DOM node id of the load URL button
*	@property {String} urlClearButtonId The DOM node id of the clear URL button
*	@property {String} urlFormGroup The DOM node id of the url form group
*	@property {String} urlFeedback The DOM node id where the url input feedback is shown
*	@property {String} titleInputId The DOM node id of the slide title input
*	@property {String} titleFormGroup The DOM node id of the slide title form group
*	@property {String} titleFeedback The DOM node id where the title input feedback is shown
*	@property {String} resetSlideButtonId The DOM node id of the reset slide button
*	@property {String} textInputId The DOM node id of the description text area
*/
function InfoPanel(index, options) {

	const _defaultOptions = {

		panelId: "#dataSection",
		urlInputId: "#urlMap",
		urlLoadButtonId: "#storymap_load",
		urlClearButtonId: "#storymap_unload",
		urlFormGroup: "#urlFormGroup",
		urlFeedback: "#urlMapFeedback",
		titleInputId: "#title",
		titleFormGroup: "#titleFormGroup",
		titleFeedback: "#titleFeedback",
		resetSlideButtonId: "#storymap_reset_slide",
		textInputId: "#summernote",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);
	this.isDirty = false;
	this.loadedData = {};

	this.addEvents();
	this.setupSummernote();

	this.reset();

}

/**
*	Adds the events the SettingsPanel should respond to
*	@access private
*/
InfoPanel.prototype.addEvents = function () {

	const self = this;

	$(self.options.urlLoadButtonId).on("click", () => {

		self.setURL();

	});

	$(self.options.urlClearButtonId).on("click", () => {

		$(self.options.urlInputId).val("");
		self.disableURLButtons(false);
		$(self).trigger("InfoPanel:clearURLPressed");

	});

	$(self.options.resetSlideButtonId).on("click", () => {

		self.reset();
		self.setDirty(true);

	});

	$(self.options.urlInputId).on("input", () => {

		self.checkURL();

	});

	$(self.options.titleInputId).on("input", () => {

		self.checkTitol();

	});

	$(self.options.textInputId).on("summernote.change", () => {

		self.checkText();

	});

	$(self.options.urlInputId).keyup((event) => {

		const url = $(this.options.urlInputId).val();

		if (event.keyCode === 13 && Utils.isValidURL(url)) {

			$(self.options.urlLoadButtonId).click();

		}

	});

};

/**
*	Setups the text area WYSIWYG editor
*	@access private
*/
InfoPanel.prototype.setupSummernote = function () {

	$(this.options.textInputId).summernote({
		disableDragAndDrop: true,
		dialogsInBody: true,
		toolbar: [
			["style", ["color"]],
			["style", ["style"]],
			["style", ["bold", "underline", "clear"]],
			["style", ["fontname"]],
			["para", ["ul", "ol", "paragraph"]],
			["insert", ["table"]],
			["insert", ["link", "picture", "video"]],
			["misc", ["fullscreen", "codeview", "help"]],
		],
	});

	// Hide the "Upload picture" form 
	$(".note-group-select-from-files").hide();

};

/**
*	Checks if the url found in the URL input is a valid URL. If it's, the buttons are
*	enabled and the slide is set as dirty. If not, the buttons are disabled and the
*	slide inputs are disabled
*	@access private
*/
InfoPanel.prototype.checkURL = function () {

	const url = $(this.options.urlInputId).val();

	if (Utils.isValidURL(url)) {

		this.enableURLButtons();
		this.setDirty(true);

	} else {

		this.disableURLButtons();

	}

};

/**
*	Enables the url buttons
*	@access private
*/
InfoPanel.prototype.enableURLButtons = function () {

	$(this.options.urlFormGroup).removeClass("has-error");
	$(this.options.urlFeedback).hide();
	$(this.options.urlLoadButtonId).prop("disabled", false);
	$(this.options.urlClearButtonId).prop("disabled", false);

};

/**
*	Enables the slide inputs
*	@access private
*/
InfoPanel.prototype.enableSlideInputs = function () {

	$(this.options.titleFormGroup).removeClass("has-error");
	$(this.options.titleFeedback).hide();
	$(this.options.textInputId).summernote("enable");
	$(this.options.titleInputId).prop("disabled", false);
	$(this.options.resetSlideButtonId).prop("disabled", false);

};

/**
*	Disables the url buttons
*	@param {boolean} showFeedback A boolean telling if feedback should be shown or not
*	@access private
*/
InfoPanel.prototype.disableURLButtons = function (showFeedback) {

	const shouldShowFeedback = showFeedback || (showFeedback === undefined);

	if (shouldShowFeedback) {

		$(this.options.urlFormGroup).addClass("has-error");
		$(this.options.urlFeedback).show();

	}

	$(this.options.urlLoadButtonId).prop("disabled", true);
	$(this.options.urlClearButtonId).prop("disabled", true);

};

/**
*	Disables the slide inputs
*	@param {boolean} showFeedback A boolean telling if feedback should be shown or not
*	@access private
*/
InfoPanel.prototype.disableSlideInputs = function (showFeedback) {

	const shouldShowFeedback = showFeedback || (showFeedback === undefined);

	if (shouldShowFeedback) {

		$(this.options.titleFormGroup).addClass("has-error");
		$(this.options.titleFeedback).show();

	}

	$(this.options.textInputId).summernote("disable");
	$(this.options.resetSlideButtonId).prop("disabled", true);
	$(this.options.titleInputId).prop("disabled", true);

};

/**
*	Checks if the title input is good and if it is, sets the slide as dirty
*	@access private
*/
InfoPanel.prototype.checkTitol = function () {

	const text = $(this.options.titleInputId).val();

	if (Utils.isNotEmpty(text)) {

		this.setDirty(true);

	}

};

/**
*	Checks if the title input is good and if it is, sets the slide as dirty
*	@access private
*/
InfoPanel.prototype.checkText = function () {

	const text = $(this.options.textInputId).summernote("code");

	if (Utils.isNotEmpty(text)) {

		this.setDirty(true);

	}

};

/**
*	Sets the slide as dirty
*	@param {boolean} isDirty A boolean telling if the slide info is dirty or not
*	@access private
*/
InfoPanel.prototype.setDirty = function (isDirty) {

	this.isDirty = isDirty;

};

/**
*	Loads the slide url
*	@access private
*	@emits "InfoPanel:loadURL" when the url is loaded
*/
InfoPanel.prototype.setURL = function () {

	const self = this;

	const url = $(self.options.urlInputId).val();
	$(self).trigger("InfoPanel:loadURL", [url]);

};

/**
*	Gets the url input value
*	@access public
*/
InfoPanel.prototype.getURL = function () {

	return $(this.options.urlInputId).val();

};

/**
*	Gets the title input value
*	@access public
*/
InfoPanel.prototype.getTitol = function () {

	return $(this.options.titleInputId).val();

};

/**
*	Gets the description input value
*	@access public
*/
InfoPanel.prototype.getDescripcio = function () {

	return $(this.options.textInputId).summernote("code");

};

/**
*	Resets the info panel to the starting slide data
*	@access public
*	@emits "InfoPanel:loadURL" when the url is loaded
*	@emits "InfoPanel:clearURLPressed" when the clear url button is pressed
*/
InfoPanel.prototype.reset = function () {

	const title = this.loadedData.titol || "";
	const desc = this.loadedData.descripcio || "";
	const url = this.loadedData.url || "";

	$(this.options.titleInputId).val(title);
	$(this.options.textInputId).summernote("code", desc);
	$(this.options.titleFormGroup).removeClass("has-error");
	$(this.options.titleFeedback).hide();
	$(this.options.urlInputId).val(url);

	if (url.trim() !== "") {

		$(this).trigger("InfoPanel:loadURL", [url]);
		this.enableURLButtons();

	} else {

		$(this).trigger("InfoPanel:clearURLPressed");
		this.disableURLButtons();

	}

};

/**
*	Clears the info panel
*	@access public
*/
InfoPanel.prototype.clean = function () {

	const title = "";
	const desc = "";
	const url = "";

	$(this.options.titleInputId).val(title);
	$(this.options.textInputId).summernote("code", desc);
	$(this.options.titleFormGroup).removeClass("has-error");
	$(this.options.titleFeedback).hide();
	$(this.options.urlInputId).val(url);

	this.disableURLButtons();

};

/**
*	Sets the info panel information
*	param {String} url The url string
*	param {title} titol The title string
*	param {title} descripcio The description string
*	@access public
*	@emits "InfoPanel:loadURL" when the URL is loaded
*/
InfoPanel.prototype.setData = function (url, titol, descripcio) {

	this.loadedData = { url, titol, descripcio };

	if (url && url !== "") {

		this.enableURLButtons();

	} else {

		this.disableURLButtons();

	}

	$(this).trigger("InfoPanel:loadURL", [url]);
	$(this.options.urlInputId).val(url);
	$(this.options.titleInputId).val(titol);
	$(this.options.textInputId).summernote("code", descripcio);

};

/**
*	Shows the info panel
*	@access public
*/
InfoPanel.prototype.show = function () {

	$(this.options.panelId).show();

};

/**
*	Hides the info panel
*	@access public
*/
InfoPanel.prototype.hide = function () {

	$(this.options.panelId).hide();

};
