/* global $*/

function SlideInfo(index, options) {

	const _defaultOptions = {

		urlLoadButtonId: "#storymap_load",
		urlClearButtonId: "#storymap_unload",
		infoButtonId: "#obrir_menu",
		saveSlideButtonId: "#storymap_save_slide",
		urlInputId: "#urlMap",
		titolInputId: "#urlMap",
		textInputId: "#summernote",
		iFrameId: "#instamapsMap",
		iFrameContainerId: "#mapaFrame",
		dataContainerId: "#dataSection",
		defaultUrl: "https://www.instamaps.cat/geocatweb/visor.html",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);

	this.addEvents();

	$(this.options.textInputId).summernote();

}

SlideInfo.prototype.addEvents = function () {

	const self = this;

	$(self.options.urlLoadButtonId).on("click", () => {

		const url = $(self.options.urlInputId).val();
		$(self.options.iFrameId).attr("src", url);

	});

	$(self.options.urlClearButtonId).on("click", () => {

		$(self.options.urlInputId).val("");
		$(self.options.iFrameId).attr("src", self.options.defaultUrl);

	});

	$(self.options.infoButtonId).on("click", () => {

		if ($(self.options.iFrameContainerId).hasClass("expanded")) {

			$(self.options.iFrameContainerId).removeClass("expanded");
			$(self.options.dataContainerId).hide();

		} else {

			$(self.options.iFrameContainerId).addClass("expanded");
			$(self.options.dataContainerId).show();

		}

	});

	$(self.options.saveSlideButtonId).on("click", () => {

		$(this).trigger("SlideInfo:saveSlidePressed");

	});

};

SlideInfo.prototype.getURL = function () {

	return $(this.options.urlInputId).val();

};

SlideInfo.prototype.getTitol = function () {

	return $(this.options.titolInputId).val();

};

SlideInfo.prototype.getDescripcio = function () {

	return $(this.options.textInputId).summernote("click");

};

SlideInfo.prototype.reset = function () {

	$(this.options.iFrameId).src = "http://www.instamaps.cat/geocatweb/visor.html";
	$(this.options.urlInputId).val("");
	$(this.options.titolInputId).val("");
	$(this.options.textInputId).summernote("click", "");

};
