/* global $, SlideIcon*/

function SlideBar(options) {

	const _defaultOptions = {
		maxSlides: 10,
		slideIconRegex: /^slide-icon-\w+$/,
		slidesContainerId: "#slidesContainer",
		slideListId: "#slideList",
		addSlideButton: "#storymap_add_slide",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);

	this.addEvents();

}

SlideBar.prototype.addEvents = function () {

	const self = this;

	$(self.options.addSlideButton).click(() => {

		$(self).trigger("SlideBar:addSlidePressed");

	});

};

SlideBar.prototype.addSlide = function () {

	const self = this;

	const slide = new SlideIcon();
	slide.appendTo(this.options.slideListId);

	$(slide).on("Slide:deletePressed", (event, id) => {

		$(self).trigger("SlideBar:deleteSlidePressed", [id]);

	});

	$(slide).on("Slide:selected", (event, id) => {

		$(self).trigger("SlideBar:slideSelected", [id]);

	});


	$(this.options.slidesContainerId).scrollTop(Math.max(0, $(this.options.slideListId).height() -
		$(this.options.slideListId).parent().height()));
	slide.clicked();

};

SlideBar.prototype.removeSlide = function (id) {

	$(`${this.options.slideListId} li:nth-child(${id + 1})`).remove();

};
