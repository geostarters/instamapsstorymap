/* global $*/

// TODO: Create parent class with the methods common to SettingsPanel and InfoPanel

function SettingsPanel(index, options) {

	const _defaultOptions = {

		overlappedButtonId: "#superposat",
		noOverlappedButtonId: "#noSuperposat",
		animParametersPanelId: "#animParams",
		animCheckbox: "#animCheckbox",
		panelId: "#settingsSection",
		carouselTime: "#carouselTime",
		pauseCheckbox: "#pauseCheckbox",
		rideCheckbox: "#rideCheckbox",
		afterFirstCheckbox: "#afterFirstCheckbox",
		wrapCheckbox: "#wrapCheckbox",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);
	this.isOverlapped = true;
	this.isDirty = false;

	this.addEvents();
	this.reset();

}

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

SettingsPanel.prototype.reset = function () {

	this.enableOverlappedMode(true);
	this.isDirty = false;

};

SettingsPanel.prototype.show = function () {

	$(this.options.panelId).show();

};

SettingsPanel.prototype.hide = function () {

	$(this.options.panelId).hide();

};

SettingsPanel.prototype.enableAnimParameters = function (shouldEnable) {

	if (shouldEnable) {

		$(this.options.animParametersPanelId).addClass("showAnimParams").removeClass("hideAnimParams");

	} else {

		$(this.options.animParametersPanelId).removeClass("showAnimParams").addClass("hideAnimParams");

	}

};

SettingsPanel.prototype.getOverlappingMode = function () {

	return ($(this.options.overlappedButtonId).hasClass("active") ? "overlapped" : "noOverlapped");

};

SettingsPanel.prototype.isAnimated = function () {

	return $(this.options.animCheckbox).prop("checked");

};

SettingsPanel.prototype.getTimeBetweenSlides = function () {

	return $(this.options.carouselTime).val();

};

SettingsPanel.prototype.shouldPauseOnHover = function () {

	return $(this.options.pauseCheckbox).prop("checked");

};

SettingsPanel.prototype.shouldStartOnLoad = function () {

	return $(this.options.rideCheckbox).prop("checked");

};

SettingsPanel.prototype.shouldAnimOnFirstSlide = function () {

	return $(this.options.afterFirstCheckbox).prop("checked");

};

SettingsPanel.prototype.shouldLoop = function () {

	return $(this.options.wrapCheckbox).prop("checked");

};

SettingsPanel.prototype.setOverlappingMode = function (shouldOverlap) {

	this.enableOverlappedMode(shouldOverlap === "overlapped");

};

SettingsPanel.prototype.setIsAnimated = function (shouldAnimate) {

	$(this.options.animCheckbox).prop("checked", shouldAnimate);
	this.enableAnimParameters(shouldAnimate);

};

SettingsPanel.prototype.setTimeBetweenSlides = function (time) {

	$(this.options.carouselTime).val(time);

};

SettingsPanel.prototype.setPauseOnHover = function (shouldPause) {

	$(this.options.pauseCheckbox).prop("checked", shouldPause);

};

SettingsPanel.prototype.setStartOnLoad = function (shouldStart) {

	$(this.options.rideCheckbox).prop("checked", shouldStart);

};

SettingsPanel.prototype.setAnimOnFirstSlide = function (shouldAnimate) {

	$(this.options.afterFirstCheckbox).prop("checked", shouldAnimate);

};

SettingsPanel.prototype.setLoop = function (shouldLoop) {

	$(this.options.wrapCheckbox).prop("checked", shouldLoop);

};
