/* global Utils, $*/

function SlideInfo(index, options) {

	const _defaultOptions = {

		urlLoadButtonId: "#storymap_load",
		urlClearButtonId: "#storymap_unload",
		infoButtonId: "#obrir_menu",
		saveSlideButtonId: "#storymap_save_slide",
		resetSlideButtonId: "#storymap_reset_slide",
		urlInputId: "#urlMap",
		titolInputId: "#headline",
		textInputId: "#summernote",
		iFrameId: "#instamapsMap",
		noURLId: "#noURLLoaded",
		iFrameContainerId: "#mapaFrame",
		dataContainerId: "#dataSection",
		defaultUrl: "https://www.instamaps.cat/geocatweb/visor.html?embed=1",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);
	this.isDirty = false;

	this.addEvents();

	$(this.options.textInputId).summernote();
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

	});

	$(self.options.infoButtonId).on("click", () => {

		if ($(self.options.iFrameContainerId).hasClass("expanded")) {

			self.open();

		} else {

			self.close();

		}

	});

	$(self.options.saveSlideButtonId).on("click", () => {

		self.enableSaving(false);
		$(self).trigger("SlideInfo:saveSlidePressed");

	});

	$(self.options.resetSlideButtonId).on("click", () => {

		self.reset();

	});

	$(self.options.urlInputId).on("input", () => {

		self.checkURL();

	});

	$(self.options.titolInputId).on("input", () => {

		self.checkTitol();

	});

	$(self.options.textInputId).on("summernote.change", () => {

		self.checkText();

	});

};

SlideInfo.prototype.checkURL = function () {

	const url = $(this.options.urlInputId).val();

	if (Utils.isValidURL(url)) {

		this.setDirty(true);

	}

};

SlideInfo.prototype.checkTitol = function () {

	const text = $(this.options.titolInputId).val();

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
	if (Utils.isValidURL(url)) {

		$(self.options.iFrameId).attr("src", url);
		$(this.options.noURLId).hide();
		$(this.options.iFrameId).show();

	} else {

		$(self).trigger("SlideInfo:invalidURL");

	}

};

SlideInfo.prototype.getURL = function () {

	return $(this.options.urlInputId).val();

};

SlideInfo.prototype.getTitol = function () {

	return $(this.options.titolInputId).val();

};

SlideInfo.prototype.getDescripcio = function () {

	return $(this.options.textInputId).summernote("code");

};

SlideInfo.prototype.reset = function () {

	$(this.options.iFrameId).hide();
	$(this.options.noURLId).show();
	$(this.options.urlInputId).val("");
	$(this.options.titolInputId).val("");
	$(this.options.textInputId).summernote("code", "");

};

SlideInfo.prototype.setData = function (url, titol, descripcio) {

	if (url && url !== "") {

		$(this.options.iFrameId).attr("src", url);
		$(this.options.noURLId).hide();
		$(this.options.iFrameId).show();

	} else {

		$(this.options.iFrameId).hide();
		$(this.options.noURLId).show();

	}

	$(this.options.urlInputId).val(url);
	$(this.options.titolInputId).val(titol);
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
