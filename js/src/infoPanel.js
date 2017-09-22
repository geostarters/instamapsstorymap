/* global Utils, $*/

function InfoPanel(index, options) {

	const _defaultOptions = {

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
		panelId: "#dataSection",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);
	this.isDirty = false;
	this.loadedData = {};

	this.addEvents();
	this.setupSummernote();

	this.reset();

}

InfoPanel.prototype.addEvents = function () {

	const self = this;

	$(self.options.urlLoadButtonId).on("click", () => {

		self.setURL();

	});

	$(self.options.urlClearButtonId).on("click", () => {

		$(self.options.urlInputId).val("");
		self.disableURLButtons(false);
		self.disableSlideInputs(false);
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

InfoPanel.prototype.setupSummernote = function () {

	$(this.options.textInputId).summernote({ disableDragAndDrop: true,
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

InfoPanel.prototype.checkURL = function () {

	const url = $(this.options.urlInputId).val();

	if (Utils.isValidURL(url)) {

		this.enableURLButtons();
		this.setDirty(true);

	} else {

		this.disableURLButtons();
		this.disableSlideInputs(false);

	}

};

InfoPanel.prototype.enableURLButtons = function () {

	$(this.options.urlFormGroup).removeClass("has-error");
	$(this.options.urlFeedback).hide();
	$(this.options.urlLoadButtonId).prop("disabled", false);
	$(this.options.urlClearButtonId).prop("disabled", false);

};

InfoPanel.prototype.enableSlideInputs = function () {

	$(this.options.titleFormGroup).removeClass("has-error");
	$(this.options.titleFeedback).hide();
	$(this.options.textInputId).summernote("enable");
	$(this.options.titleInputId).prop("disabled", false);
	$(this.options.resetSlideButtonId).prop("disabled", false);

};

InfoPanel.prototype.disableURLButtons = function (showFeedback) {

	const shouldShowFeedback = showFeedback || (showFeedback === undefined);

	if (shouldShowFeedback) {

		$(this.options.urlFormGroup).addClass("has-error");
		$(this.options.urlFeedback).show();

	}

	$(this.options.urlLoadButtonId).prop("disabled", true);
	$(this.options.urlClearButtonId).prop("disabled", true);

};

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

InfoPanel.prototype.checkTitol = function () {

	const text = $(this.options.titleInputId).val();

	if (Utils.isNotEmpty(text)) {

		this.setDirty(true);

	}

};

InfoPanel.prototype.checkText = function () {

	const text = $(this.options.textInputId).summernote("code");

	if (Utils.isNotEmpty(text)) {

		this.setDirty(true);

	}

};

InfoPanel.prototype.setDirty = function (isDirty) {

	this.isDirty = isDirty;

};

InfoPanel.prototype.setURL = function () {

	const self = this;

	const url = $(self.options.urlInputId).val();
	$(self).trigger("InfoPanel:loadURL", [url]);
	self.enableSlideInputs();

};

InfoPanel.prototype.getURL = function () {

	return $(this.options.urlInputId).val();

};

InfoPanel.prototype.getTitol = function () {

	return $(this.options.titleInputId).val();

};

InfoPanel.prototype.getDescripcio = function () {

	return $(this.options.textInputId).summernote("code");

};

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
		$(this.options.textInputId).summernote("enable");
		this.enableURLButtons();
		this.enableSlideInputs();

	} else {

		$(this).trigger("InfoPanel:clearURLPressed");
		$(this.options.textInputId).summernote("disable");
		this.disableURLButtons();
		this.disableSlideInputs();

	}

};

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
	this.disableSlideInputs();

};

InfoPanel.prototype.setData = function (url, titol, descripcio) {

	this.loadedData = { url, titol, descripcio };

	if (url && url !== "") {

		this.enableSlideInputs();
		this.enableURLButtons();
		$(this).trigger("InfoPanel:loadURL", [url]);

	} else {

		this.disableSlideInputs();
		this.disableURLButtons();

	}

	$(this.options.urlInputId).val(url);
	$(this.options.titleInputId).val(titol);
	$(this.options.textInputId).summernote("code", descripcio);

};

InfoPanel.prototype.show = function () {

	$(this.options.panelId).show();

};

InfoPanel.prototype.hide = function () {

	$(this.options.panelId).hide();

};
