/* global InfoPanel, SettingsPanel, Utils, $*/

function SlideInfo(index, options) {

	const _defaultOptions = {

		infoButtonId: "#obrir_menu",
		settingsButtonId: "#settings_menu",
		closeButtonId: "#hide_menu",
		iFrameId: "#instamapsMap",
		noURLId: "#noURLLoaded",
		menuContainerId: "#mapviewer-floating-sidemenu",
		mapaFrame: "#mapaFrame",
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

	$(this.settingsPanel).on("Settings:overlappingChanged", (event, isOverlapped) => {

		if (isOverlapped) {

			$(this.options.mapaFrame).removeClass("collapsed");
			$(this.options.mapaFrame).addClass("expanded");

		} else {

			$(this.options.mapaFrame).removeClass("expanded");
			$(this.options.mapaFrame).addClass("collapsed");

		}

	});

	$(this.infoPanel).on("InfoPanel:loadURL", (event, url) => {

		$(self.options.iFrameId).attr("src", Utils.addProtocolIfNeeded(url));
		$(this.options.noURLId).hide();
		$(this.options.iFrameId).show();

	});

	$(this.infoPanel).on("InfoPanel:clearURLPressed", () => {

		$(this.options.noURLId).show();
		$(this.options.iFrameId).hide();
		$(self.options.iFrameId).attr("src", "");

	});

};

SlideInfo.prototype.reset = function () {

	this.infoPanel.reset();

};

SlideInfo.prototype.clean = function () {

	this.infoPanel.clean();

};

SlideInfo.prototype.close = function () {

	$(this.options.menuContainerId).removeClass("showFloatingMenu");
	$(this.options.menuContainerId).addClass("hideFloatingMenu");
	$(this.options.closeButtonId).removeClass("reveal");

};

SlideInfo.prototype.open = function () {

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

SlideInfo.prototype.getURL = function () {

	return this.infoPanel.getURL();

};

SlideInfo.prototype.getTitol = function () {

	return this.infoPanel.getTitol();

};

SlideInfo.prototype.getDescripcio = function () {

	return this.infoPanel.getDescripcio();

};
