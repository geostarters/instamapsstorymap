/* global $, _*/

function SlideIcon(options) {

	const _defaultOptions = {

		text: "",
		templateId: "#storymap_slide_template",
		slideClass: ".slide",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);

	this.template = _.template($(this.options.templateId).html().trim());
	this.slideDOMElem = $(this.template(this.options));
	this.deleteDOMElem = $("<a class=\"close\" href=\"javascript:\">&nbsp;</a>");

	this.addEvents();

}

SlideIcon.prototype.addEvents = function () {

	const self = this;

	self.slideDOMElem.click(() => {

		self.clicked();

	});

	self.deleteDOMElem.click(() => {

		self.deleteButtonPressed();

	});

};

SlideIcon.prototype.clicked = function () {

	const self = this;

	const currentSlideIndex = $(self.options.slideClass).index(self.slideDOMElem);
	$(":focus").blur(); // force change event!

	$(`${this.options.slideClass}.selected`).removeClass("selected");
	$(self.slideDOMElem).addClass("selected");

	$(self).trigger("Slide:selected", [currentSlideIndex]);

	return false;

};

SlideIcon.prototype.deleteButtonPressed = function () {

	const self = this;

	const currentSlideIndex = $(self.options.slideClass).index(self.slideDOMElem);
	$(self).trigger("Slide:deleted", [currentSlideIndex]);

};

SlideIcon.prototype.appendTo = function (id) {

	this.slideDOMElem.appendTo(id);
	this.deleteDOMElem.appendTo(this.slideDOMElem);

};
