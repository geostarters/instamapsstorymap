/* global $*/

/**
*	Constructs a SettingsPanel object that represents the setting panel
*	@param {Object} options An object containing the following properties
*	@property {String} panelId The DOM node id of the panel containing the settings panel
*	@property {String} overlappedButtonId The DOM node id of the overlapped button
*	@property {String} noOverlappedButtonId The DOM node id of the non overlapped button
*	@property {String} animParametersPanelId The DOM node id of the animation parameters panel
*	@property {String} animCheckbox The DOM node id of the animation checkbox
*	@property {String} carouselTime The DOM node id where the seconds between slides is input
*	@property {String} pauseCheckbox The DOM node id of the pause on hover checkbox
*	@property {String} rideCheckbox The DOM node id of the should start on load checkbox
*	@property {String} afterFirstCheckbox The DOM node id of the should animate after first slide
*	 checkbox
*	@property {String} wrapCheckbox The DOM node id of the should loop checkbox
*/
function SettingsPanel(index, options) {

	const _defaultOptions = {

		panelId: "#settingsSection",
		overlappedButtonId: "#superposat",
		noOverlappedButtonId: "#noSuperposat",
		animParametersPanelId: "#animParams",
		animCheckbox: "#animCheckbox",
		carouselTime: "#carouselTime",
		pauseCheckbox: "#pauseCheckbox",
		rideCheckbox: "#rideCheckbox",
		afterFirstCheckbox: "#afterFirstCheckbox",
		wrapCheckbox: "#wrapCheckbox",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);
	this.isOverlapped = false;
	this.isDirty = false;

	this.addEvents();
	this.reset();

}

/**
*	Adds the events the SettingsPanel should respond to
*	@access private
*/
SettingsPanel.prototype.addEvents = function () {

	const self = this;

	$(self.options.overlappedButtonId).on("click", () => {

		self.enableOverlappedMode(true);

	});

	$(self.options.noOverlappedButtonId).on("click", () => {

		self.enableOverlappedMode(false);

	});

	$(self.options.animCheckbox).on("change", () => {

		if ($(self.options.animCheckbox).is(":checked")) {

			self.enableAnimParameters(true);

		} else {

			self.enableAnimParameters(false);

		}

	});

};

/**
*	Sets the overlapping mode
*	@param {boolean} shouldEnable A boolean telling if the right bar should overlap the slide
*	@access private
*	@emits "Settings:overlappingChanged" when the overlapping mode has changed
*/
SettingsPanel.prototype.enableOverlappedMode = function (shouldEnable) {

	if (shouldEnable) {

		this.isOverlapped = true;
		$(this.options.overlappedButtonId).addClass("active");
		$(this.options.noOverlappedButtonId).removeClass("active");

	} else {

		this.isOverlapped = false;
		$(this.options.overlappedButtonId).removeClass("active");
		$(this.options.noOverlappedButtonId).addClass("active");

	}

	$(this).trigger("Settings:overlappingChanged", [this.isOverlapped]);
	this.isDirty = true;

};

/**
*	Reset the settings panel
*	@access public
*/
SettingsPanel.prototype.reset = function () {

	this.enableOverlappedMode(false);
	this.isDirty = false;

};

/**
*	Shows the settings panel
*	@access public
*/
SettingsPanel.prototype.show = function () {

	$(this.options.panelId).show();

};

/**
*	Hides the settings panel
*	@access public
*/
SettingsPanel.prototype.hide = function () {

	$(this.options.panelId).hide();

};

/**
*	Enables or disables the animation parameters
*	@param {boolean} shouldEnable A boolean telling if the animation parameters panel should
*	be visible or not
*	@access private
*/
SettingsPanel.prototype.enableAnimParameters = function (shouldEnable) {

	if (shouldEnable) {

		$(this.options.animParametersPanelId).addClass("showAnimParams").removeClass("hideAnimParams");

	} else {

		$(this.options.animParametersPanelId).removeClass("showAnimParams").addClass("hideAnimParams");

	}

};

/**
*	Gets the overlapping mode
*	@access public
*	@returns {String} The name of the overlapping mode ("overlapped" or "nonOverlapped")
*/
SettingsPanel.prototype.getOverlappingMode = function () {

	return ($(this.options.overlappedButtonId).hasClass("active") ? "overlapped" : "noOverlapped");

};

/**
*	Gets the animated setting
*	@access public
*	@returns {boolean} A boolean telling if the StoryMap is animated or not
*/
SettingsPanel.prototype.isAnimated = function () {

	return $(this.options.animCheckbox).prop("checked");

};

/**
*	Gets the time between slides setting
*	@access public
*	@returns {Number} The number of seconds that the StoryMap waits before moving to the next slide
*/
SettingsPanel.prototype.getTimeBetweenSlides = function () {

	return $(this.options.carouselTime).val();

};

/**
*	Gets the should pause on hover setting
*	@access public
*	@returns {boolean} A boolean telling if the StoryMap should wait when the mouse is hovered on the
*	slide
*/
SettingsPanel.prototype.shouldPauseOnHover = function () {

	return $(this.options.pauseCheckbox).prop("checked");

};

/**
*	Gets the should start on load setting
*	@access public
*	@returns {boolean} A boolean telling if the StoryMap should start when its just loaded
*/
SettingsPanel.prototype.shouldStartOnLoad = function () {

	return $(this.options.rideCheckbox).prop("checked");

};

/**
*	Gets the should anim on first slide setting
*	@access public
*	@returns {boolean} A boolean telling if the StoryMap should animate after the first slide
*	has been viewed
*/
SettingsPanel.prototype.shouldAnimOnFirstSlide = function () {

	return $(this.options.afterFirstCheckbox).prop("checked");

};

/**
*	Gets the should loop setting
*	@access public
*	@returns {boolean} A boolean telling if the StoryMap should return to the first slide
*	after the last one is viewed
*/
SettingsPanel.prototype.shouldLoop = function () {

	return $(this.options.wrapCheckbox).prop("checked");

};

/**
*	Sets the overlapping mode
*	@access public
*	@param {boolean} shouldOverlap A boolean telling if the right bar should be overlapped
*	or not
*/
SettingsPanel.prototype.setOverlappingMode = function (shouldOverlap) {

	this.enableOverlappedMode(shouldOverlap === "overlapped");

};

/**
*	Sets the animated setting
*	@access public
*	@param {boolean} shouldAnimate A boolean telling if the StoryMap should be animated
*	or not
*/
SettingsPanel.prototype.setIsAnimated = function (shouldAnimate) {

	$(this.options.animCheckbox).prop("checked", shouldAnimate);
	this.enableAnimParameters(shouldAnimate);

};

/**
*	Sets the time between slides setting
*	@access public
*	@param {Number} time The number of seconds the StoryMap waits before moving to the next
*	slide
*/
SettingsPanel.prototype.setTimeBetweenSlides = function (time) {

	$(this.options.carouselTime).val(time);

};

/**
*	Sets the should pause on hover setting
*	@access public
*	@param {boolean} shouldPause A boolean telling if the StoryMap should be paused
*	when the mouse is hovering the slide or not
*/
SettingsPanel.prototype.setPauseOnHover = function (shouldPause) {

	$(this.options.pauseCheckbox).prop("checked", shouldPause);

};

/**
*	Sets the should start on load setting
*	@access public
*	@param {boolean} shouldStart A boolean telling if the StoryMap should start the
*	animation on load or not
*/
SettingsPanel.prototype.setStartOnLoad = function (shouldStart) {

	$(this.options.rideCheckbox).prop("checked", shouldStart);

};

/**
*	Sets the animate on first slide setting
*	@access public
*	@param {boolean} shouldStart A boolean telling if the StoryMap should start the animation
*	after the first slide is viewed or not
*/
SettingsPanel.prototype.setAnimOnFirstSlide = function (shouldAnimate) {

	$(this.options.afterFirstCheckbox).prop("checked", shouldAnimate);

};

/**
*	Sets the loop setting
*	@access public
*	@param {boolean} shouldStart A boolean telling if the StoryMap should loop when the last
*	slide is reached or not
*/
SettingsPanel.prototype.setLoop = function (shouldLoop) {

	$(this.options.wrapCheckbox).prop("checked", shouldLoop);

};
