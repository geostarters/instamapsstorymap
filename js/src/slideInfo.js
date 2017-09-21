/* global InfoPanel, SettingsPanel, $*/

function SlideInfo(index, options) {

	const _defaultOptions = {

		infoButtonId: "#obrir_menu",
		settingsButtonId: "#settings_menu",
		closeButtonId: "#hide_menu",
		iFrameId: "#instamapsMap",
		noURLId: "#noURLLoaded",
		menuContainerId: "#mapviewer-floating-sidemenu",
		defaultUrl: "https://www.instamaps.cat/geocatweb/visor.html?embed=1",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);
	this.isDirty = false;
	this.infoPanel = new InfoPanel();
	this.settingsPanel = new SettingsPanel();
	this.currentPanel = this.infoPanel;

	this.addEvents();
	this.reset();

}

SlideInfo.prototype.addEvents = function () {

	const self = this;

	$(self.options.infoButtonId).on("click", () => {

		if ($(self.options.menuContainerId).hasClass("hideFloatingMenu")) {

			self.open();

		} else if (this.infoPanel === this.currentPanel) {

			self.close();

		}

		self.showInfoPanel();

	});

	$(self.options.settingsButtonId).on("click", () => {

		if ($(self.options.menuContainerId).hasClass("hideFloatingMenu")) {

			self.open();

		} else if (this.settingsPanel === this.currentPanel) {

			self.close();

		}

		self.showSettingsPanel();

	});

	$(self.options.closeButtonId).on("click", () => {

		self.close();

	});

};

SlideInfo.prototype.reset = function () {

	this.infoPanel.reset();
	this.settingsPanel.reset();

};

SlideInfo.prototype.close = function () {

	$(this.options.menuContainerId).removeClass("collapsed");
	$(this.options.menuContainerId).addClass("expanded");
	$(this.options.menuContainerId).removeClass("showFloatingMenu");
	$(this.options.menuContainerId).addClass("hideFloatingMenu");
	$(this.options.closeButtonId).removeClass("reveal");

};

SlideInfo.prototype.open = function () {

	$(this.options.menuContainerId).removeClass("expanded");
	$(this.options.menuContainerId).addClass("collapsed");
	$(this.options.menuContainerId).removeClass("hideFloatingMenu");
	$(this.options.menuContainerId).addClass("showFloatingMenu");
	$(this.options.closeButtonId).addClass("reveal");

};

SlideInfo.prototype.showInfoPanel = function () {

	this.infoPanel.show();
	this.settingsPanel.hide();
	this.currentPanel = this.infoPanel;

};

SlideInfo.prototype.showSettingsPanel = function () {

	this.infoPanel.hide();
	this.settingsPanel.show();
	this.currentPanel = this.settingsPanel;

};

SlideInfo.prototype.setData = function (url, titol, descripcio) {

	this.infoPanel.setData(url, titol, descripcio);

};
