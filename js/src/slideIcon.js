/* global $, _*/

/**
*	Constructs a SlideIcon object that represents a slide icon on the slide bar
*	@param {Object} options An object containing the following properties
*	@property {String} templateId The DOM node id of the template used when a slide is added
*	@property {String} slideClass The DOM node class of the slide icons
*/
function SlideIcon(options) {

	const _defaultOptions = {

		templateId: "#storymap_slide_template",
		slideClass: ".slide",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);

	this.template = _.template($(this.options.templateId).html().trim());
	this.slideDOMElem = $(this.template(this.options));
	this.deleteDOMElem = $("<a class=\"close\" href=\"javascript:\">&nbsp;</a>");

	this.addEvents();

}

/**
*	Adds the events the SlideIcon should respond to
*	@access private
*/
SlideIcon.prototype.addEvents = function () {

	const self = this;

	self.slideDOMElem.click(() => {

		self.clicked();

	});

	self.deleteDOMElem.click(() => {

		self.deleteButtonPressed();

	});

};

/**
*	Triggers a slide selected event with its id as an event attribute and changes its class
*	to selected
*	@access private
*	@emits "Slide:selected"
*/
SlideIcon.prototype.clicked = function () {

	const self = this;

	const currentSlideIndex = $(self.options.slideClass).index(self.slideDOMElem);
	$(":focus").blur(); // force change event!

	$(self).trigger("Slide:selected", [currentSlideIndex]);

	$(`${this.options.slideClass}.selected`).removeClass("selected");
	$(self.slideDOMElem).addClass("selected");

	return false;

};

/**
*	Triggers a remove slide event with its id as an event attribute
*	@access private
*	@emits "Slide:deletePressed"
*/
SlideIcon.prototype.deleteButtonPressed = function () {

	const self = this;

	const currentSlideIndex = $(self.options.slideClass).index(self.slideDOMElem);
	$(self).trigger("Slide:deletePressed", [currentSlideIndex]);

};

/**
*	Appends the slide icon to a DOM node
*	@access public
*	@param {string} The DOM node id where the slide will be appended
*/
SlideIcon.prototype.appendTo = function (id) {

	this.slideDOMElem.appendTo(id);
	this.deleteDOMElem.appendTo(this.slideDOMElem);

};
