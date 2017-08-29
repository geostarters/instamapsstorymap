/* global $, alert, SlideBar, SlideInfo, StoryMapServer, Dialog*/

function StoryMap(options) {

	const _defaultOptions = {

		language: "en",
		maxSlides: 10,
		strings: {
			en: {
				maxSlides: "Maximum number of slides reached",
			},
			ca: {
				maxSlides: "Màxim número de slides assolit",
			},
			es: {
				maxSlides: "Has llegado al número máximo de slides",
			},
		},

	};

	this.options = $.extend(true, {}, _defaultOptions, options);

	this.currentDeletionIndex = -1;
	this.currentSelectedIndex = -1;
	this.slides = [];
	this.idEditor = "";
	this.idStoryMap = "";
	this.slideBar = new SlideBar();
	this.slideInfoPanel = new SlideInfo();
	this.deleteDialog = new Dialog();
	this.server = new StoryMapServer();

	this.addEvents();
	this._addSlide();

}

StoryMap.prototype.addEvents = function () {

	const self = this;

	$(self.slideInfoPanel).on("SlideInfo:saveSlidePressed", () => {

		self.saveSlide();

	});

	$(self.slideBar).on("SlideBar:slideSelected", (event, id) => {

		this.currentSelectedIndex = id;
		self._slideSelected(id);

	});

	$(self.slideBar).on("SlideBar:addSlidePressed", () => {

		self._addSlide();

	});

	$(self.slideBar).on("SlideBar:deleteSlidePressed", (event, id) => {

		self.currentDeletionIndex = id;
		self._slideDeletePressed(id);

	});

	$(self.deleteDialog).on("Dialog:accept", () => {

		self._slideDeleteConfirmed();

		if (this.currentSelectedIndex === this.currentDeletionIndex) {

			this.slideInfoPanel.clear();

		}

		self.currentDeletionIndex = -1;

	});

	$(self.deleteDialog).on("Dialog:cancel", () => {

		self.currentDeletionIndex = -1;

	});

};

StoryMap.prototype.saveSlide = function () {

	// Agafar les dades de l'slideInfoPanel i guardar-les a l'objecte de l'slide
	const slide = {
		id: this.slides.length,
		url_mapa: this.slideInfoPanel.getURL(),
		titol: this.slideInfoPanel.getTitol(),
		descripcio: this.slideInfoPanel.getDescripcio(),
	};

	this.slides.push(slide);

	// Guardem les dades al servidor
	this.save().then(() => {

		this.slideInfoPanel.reset();

	});

};

StoryMap.prototype._addSlide = function () {

	const self = this;

	const defaultData = $.extend(true, {}, self.options.slideData);
	const n = self.slides.length;
	if (n === self.options.maxSlides) {

		alert(self.options.strings[self.options.language].maxSlides);

	}	else {

		self.slides.push(defaultData);
		this.slideBar.addSlide();
		$(self).trigger("StoryMap:changed");

	}

};

StoryMap.prototype._slideSelected = function (index) {

	if (this.slides != null) {

		const currentSlide = this.slides[index];
		this.slideInfoPanel.setData(currentSlide.url_mapa, currentSlide.titol, currentSlide.descripcio);
		this.slideInfoPanel.open();

	}

};

StoryMap.prototype._slideDeletePressed = function (index) {

	const data = this.slides[index];
	const slideTitle = (data.titol || "(untitled)");

	this.deleteDialog.setMessage(`Delete "${slideTitle}" slide?`);
	this.deleteDialog.show();

};

StoryMap.prototype.save = function () {

	const deferred = $.Deferred();

	if (this.idStoryMap !== "") {

		if (this.idEditor === "") {

			// ja existeix l'storymap creat. Entrem en mode edició
			this.server.editMapSlides(this.idStoryMap).then(function (results) {

				this.idEditor = results.id_editor;

				this.server.updateMapSlides(this.idEditor, this.idStoryMap,
					JSON.stringify(this.slides)).then(

					() => {

						deferred.resolve();

					},
					() => {

						deferred.reject();

					},

				);

			},
			() => {

				deferred.reject();

			});

		} else {

			this.server.updateMapSlides(this.idEditor, this.idStoryMap, JSON.stringify(this.slides)).then(

				() => {

					deferred.resolve();

				},
				() => {

					deferred.reject();

				},

			);

		}

	} else {

		// no existeix l'storymap. En creem un de nou amb la info corresponent
		this.server.newMapSlides(JSON.stringify(this.slides)).then((results) => {

			this.idStoryMap = results.id;
			this.idEditor = results.id_editor;
			deferred.resolve();

		},
		() => {

			deferred.reject();

		});

	}

	return deferred.promise();

};

StoryMap.prototype.load = function (id) {

	this.idEditor = id;

	this.server.editMapSlides(id).then((results) => {

		this.slides = JSON.parse(results.slides);

	});

};

StoryMap.prototype._slideDeleteConfirmed = function () {

	const self = this;

	self.slides.splice(this.currentDeletionIndex, 1);
	self.slideBar.removeSlide(this.currentDeletionIndex);

};
