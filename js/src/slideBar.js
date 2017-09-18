/* global $, SlideIcon*/

function SlideBar(options) {

	const _defaultOptions = {
		maxSlides: 10,
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

SlideBar.prototype.addSlide = function (click) {

	const self = this;
	const shouldClick = click || (click === undefined);

	const slide = new SlideIcon();
	slide.appendTo(this.options.slideListId);

	$(slide).on("Slide:deletePressed", (event, id) => {

		$(self).trigger("SlideBar:deleteSlidePressed", [id]);

	});

	$(slide).on("Slide:selected", (event, id) => {

		self.slideSelectedId = id;
		$(self).trigger("SlideBar:slideSelected", [id]);

	});


	$(this.options.slidesContainerId).scrollTop(Math.max(0, $(this.options.slideListId).height() -
		$(this.options.slideListId).parent().height()));

	if (shouldClick) {

		slide.clicked();

	}

	self.updateSlideNums();

};

SlideBar.prototype.addSlides = function (slides) {

	for (let i = 0, len = slides.length; i < len; ++i) {

		this.addSlide(i === (len - 1));
		$(`${this.options.slideListId} li:nth-child(${i + 1})>.slide-title`).html(slides[i].titol);

	}

};

SlideBar.prototype.removeSlide = function (id) {

	$(`${this.options.slideListId} li:nth-child(${id + 1})`).remove();
	this.updateSlideNums();

};

SlideBar.prototype.setSlideTitle = function (text) {

	$(`${this.options.slideListId} li.selected>.slide-title`).html(text);

};

SlideBar.prototype.updateSlideNums = function () {

	$(`${this.options.slideListId} .slide-num`).each((index, elem) => {

		$(elem).html(index + 1);

	});

};

SlideBar.prototype.clear = function () {

	$(`${this.options.slideListId}`).html("");

};
