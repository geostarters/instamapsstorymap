/* global Utils, $*/

function SlideInfo(index, options) {

	const _defaultOptions = {

		urlInputId: "#urlMap",
		urlLoadButtonId: "#storymap_load",
		urlClearButtonId: "#storymap_unload",
		urlFormGroup: "#urlFormGroup",
		urlFeedback: "#urlMapFeedback",
		titleInputId: "#title",
		titleFormGroup: "#titleFormGroup",
		titleFeedback: "#titleFeedback",
		infoButtonId: "#obrir_menu",
		settingsButtonId: "#settings_menu",
		saveSlideButtonId: "#storymap_save_slide",
		resetSlideButtonId: "#storymap_reset_slide",
		textInputId: "#summernote",
		iFrameId: "#instamapsMap",
		noURLId: "#noURLLoaded",
		iFrameContainerId: "#mapaFrame",
		dataContainerId: "#dataSection",
		settingsContainerId: "#settingsSection",
		spinnerId: "#saveSlideSpinner",
		defaultUrl: "https://www.instamaps.cat/geocatweb/visor.html?embed=1",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);
	this.isDirty = false;

	this.addEvents();
	this.setupSummernote();

	this.reset();

}

SlideInfo.prototype.addEvents = function () {

	const self = this;

	$(self.options.urlLoadButtonId).on("click", () => {

		self.setURL();

	});

	$(self.options.urlClearButtonId).on("click", () => {

		$(self.options.urlInputId).val("");
		$(self.options.iFrameId).hide();
		$(self.options.noURLId).show();
		self.disableURLButtons(false);
		self.disableSlideInputs(false);

	});

	$(self.options.infoButtonId).on("click", () => {

		if ($(self.options.iFrameContainerId).hasClass("expanded")) {

			self.open();

		} else {

			self.close();

		}

		self.showInfoPanel();

	});

	$(self.options.settingsButtonId).on("click", () => {

		if ($(self.options.iFrameContainerId).hasClass("expanded")) {

			self.open();

		} else {

			self.close();

		}

		self.showSettingsPanel();

	});

	$(self.options.saveSlideButtonId).on("click", () => {

		self.enableSaving(false);
		$(self.options.spinnerId).show();
		self.disableSlideInputs();
		$(self).trigger("SlideInfo:saveSlidePressed");

	});

	$(self.options.resetSlideButtonId).on("click", () => {

		self.reset(false);
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

};

SlideInfo.prototype.setupSummernote = function () {

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

SlideInfo.prototype.checkURL = function () {

	const url = $(this.options.urlInputId).val();

	if (Utils.isValidURL(url)) {

		this.enableURLButtons();
		this.setDirty(true);

	} else {

		this.disableURLButtons();
		this.disableSlideInputs(false);

	}

};

SlideInfo.prototype.enableURLButtons = function () {

	$(this.options.urlFormGroup).removeClass("has-error");
	$(this.options.urlFeedback).hide();
	$(this.options.urlLoadButtonId).prop("disabled", false);
	$(this.options.urlClearButtonId).prop("disabled", false);

};

SlideInfo.prototype.enableSlideInputs = function () {

	$(this.options.titleFormGroup).removeClass("has-error");
	$(this.options.titleFeedback).hide();
	$(this.options.textInputId).summernote("enable");
	$(this.options.titleInputId).prop("disabled", false);
	$(this.options.resetSlideButtonId).prop("disabled", false);
	$(this.options.saveSlideButtonId).prop("disabled", false);

};

SlideInfo.prototype.disableURLButtons = function (showFeedback) {

	const shouldShowFeedback = showFeedback || (showFeedback === undefined);

	if (shouldShowFeedback) {

		$(this.options.urlFormGroup).addClass("has-error");
		$(this.options.urlFeedback).show();

	}

	$(this.options.urlLoadButtonId).prop("disabled", true);
	$(this.options.urlClearButtonId).prop("disabled", true);

};

SlideInfo.prototype.disableSlideInputs = function (showFeedback) {

	const shouldShowFeedback = showFeedback || (showFeedback === undefined);

	if (shouldShowFeedback) {

		$(this.options.titleFormGroup).addClass("has-error");
		$(this.options.titleFeedback).show();

	}

	$(this.options.textInputId).summernote("disable");
	$(this.options.resetSlideButtonId).prop("disabled", true);
	$(this.options.saveSlideButtonId).prop("disabled", true);
	$(this.options.titleInputId).prop("disabled", true);

};

SlideInfo.prototype.checkTitol = function () {

	const text = $(this.options.titleInputId).val();

	if (Utils.isNotEmpty(text)) {

		this.setDirty(true);

	}

};

SlideInfo.prototype.checkText = function () {

	const text = $(this.options.textInputId).summernote("code");

	if (Utils.isNotEmpty(text)) {

		this.setDirty(true);

	}

};

SlideInfo.prototype.setDirty = function (isDirty) {

	this.isDirty = isDirty;
	this.enableSaving(isDirty);

};

SlideInfo.prototype.setURL = function () {

	const self = this;

	const url = $(self.options.urlInputId).val();
	$(self.options.iFrameId).attr("src", url);
	$(this.options.noURLId).hide();
	$(this.options.iFrameId).show();
	self.enableSlideInputs();

};

SlideInfo.prototype.getURL = function () {

	return $(this.options.urlInputId).val();

};

SlideInfo.prototype.getTitol = function () {

	return $(this.options.titleInputId).val();

};

SlideInfo.prototype.getDescripcio = function () {

	return $(this.options.textInputId).summernote("code");

};

SlideInfo.prototype.reset = function (deleteURL) {

	const shouldDeleteURL = deleteURL || (deleteURL === undefined);

	$(this.options.titleInputId).val("");
	$(this.options.textInputId).summernote("code", "");
	$(this.options.titleFormGroup).removeClass("has-error");
	$(this.options.titleFeedback).hide();

	if (shouldDeleteURL) {

		$(this.options.urlInputId).val("");
		$(this.options.iFrameId).hide();
		$(this.options.noURLId).show();
		$(this.options.textInputId).summernote("disable");

	}

};

SlideInfo.prototype.setData = function (url, titol, descripcio) {

	if (url && url !== "") {

		$(this.options.iFrameId).attr("src", url);
		$(this.options.noURLId).hide();
		$(this.options.iFrameId).show();
		this.enableSlideInputs();
		this.enableURLButtons();

	} else {

		$(this.options.iFrameId).hide();
		$(this.options.noURLId).show();
		this.disableSlideInputs();
		this.disableURLButtons();

	}

	$(this.options.urlInputId).val(url);
	$(this.options.titleInputId).val(titol);
	$(this.options.textInputId).summernote("code", descripcio);

};

SlideInfo.prototype.close = function () {

	$(this.options.iFrameContainerId).removeClass("collapsed");
	$(this.options.iFrameContainerId).addClass("expanded");
	$(this.options.dataContainerId).hide();

};

SlideInfo.prototype.open = function () {

	$(this.options.iFrameContainerId).removeClass("expanded");
	$(this.options.iFrameContainerId).addClass("collapsed");
	$(this.options.dataContainerId).show();

};

SlideInfo.prototype.enableSaving = function (shouldEnable) {

	$(this.options.saveSlideButtonId).prop("disabled", !shouldEnable);

};

SlideInfo.prototype.saved = function () {

	this.enableSlideInputs();
	this.setDirty(false);
	$(this.options.spinnerId).hide();

};

SlideInfo.prototype.showInfoPanel = function () {

	$(this.options.dataContainerId).show();
	$(this.options.settingsContainerId).hide();

};

SlideInfo.prototype.showSettingsPanel = function () {

	$(this.options.dataContainerId).hide();
	$(this.options.settingsContainerId).show();

};
