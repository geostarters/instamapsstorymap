/* global $, SlideIcon*/

/**
*	Constructs a SlideBar object that represents the container where the icons will be placed and
*	where the add slide button and save story map button are located
*	@param {Object} options An object containing the following properties
*	@property {String} slidesContainerId The DOM node id of the container element
*	@property {String} slideListId The DOM node id of the slide list
*	@property {String} addSlideButton The DOM node id of the add slide button
*	@property {String} saveStorymapButton The DOM node id of the save story nao button
*/
function SlideBar(options) {

	const _defaultOptions = {
		slidesContainerId: "#slidesContainer",
		slideListId: "#slideList",
		addSlideButton: "#storymap_add_slide",
		saveStorymapButton: "#storymap_save",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);

	this.sortableStart = 0;
	this.sortableEnd = 0;
	this.addEvents();

}

/**
*	Adds the events the SlideBar should respond to
*	@access private
*	@emits "SlideBar:addSlidePressed" when the add slide button is pressed
*	@emits "SlideBar:saveStorymapPressed" when the save story map button is pressed
*/
SlideBar.prototype.addEvents = function () {

	const self = this;

	$(self.options.addSlideButton).click(() => {

		$(self).trigger("SlideBar:addSlidePressed");

	});

	$(self.options.saveStorymapButton).click(() => {

		$(self).trigger("SlideBar:saveStorymapPressed");

	});

	$(self.options.slideListId).sortable({
		axis: "y",
		cursor: "move",
		items: ".slide",
		start: (event, ui) => {

			self.sortableStart = $(".slide").index(ui.item);

		},
		stop: (event, ui) => {

			self.sortableEnd = $(".slide").index(ui.item);

			if (self.sortableStart !== self.sortableEnd) {

				$(self).trigger("SlideBar:slideMoved", [self.sortableStart,
					self.sortableEnd]);

				self.updateSlideNums();

			}

		},
	});

};

/**
*	Adds an slide to the SlideBar
*	@param {boolean} click A boolean telling if the slide must be clicked after
*	being added. Useful when you want the just added slide to be selected
*	@access public
*	@emits "SlideBar:slideSelected" when the slide is selected
*	@emits "SlideBar:deleteSlidePressed" when the slide delete button is pressed
*/
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

/**
*	Adds an array of slides to the SlideBar
*	@param {Array} slides An array of slide objects with a titol property
*	@access public
*/
SlideBar.prototype.addSlides = function (slides) {

	for (let i = 0, len = slides.length; i < len; ++i) {

		this.addSlide(i === (len - 1));
		const titol = (slides[i].titol.trim() !== "") ? slides[i].titol : "(Sense títol)";
		$(`${this.options.slideListId} li:nth-child(${i + 1}) .slide-title`).html(titol);

	}

};

/**
*	Removes a slide from the SlideBar
*	@param {Number} num The position of the slide to be removed in the SlideBar
*	@access public
*/
SlideBar.prototype.removeSlide = function (num) {

	$(`${this.options.slideListId} li:nth-child(${num + 1})`).remove();
	this.updateSlideNums();

};

/**
*	Sets the title of a slide on the SlideBar
*	@param {String} text The slide title
*	@access public
*/
SlideBar.prototype.setSlideTitle = function (text) {

	const title = (text.trim() !== "") ? text : "(Sense títol)";
	$(`${this.options.slideListId} li.selected .slide-title`).html(title);

};

/**
*	Sets the title of a slide on the SlideBar
*	@param {String} text The slide title
*	@access public
*/
SlideBar.prototype.updateSlideNums = function () {

	$(`${this.options.slideListId} .slide-num`).each((index, elem) => {

		$(elem).html(index + 1);

	});

};

/**
*	Removes all the SlideIcons from the SideBar
*	@access public
*/
SlideBar.prototype.clear = function () {

	$(`${this.options.slideListId}`).html("");

};
