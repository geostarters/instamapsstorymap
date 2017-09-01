/* global $, SlideBar, SlideInfo, StoryMapServer, Dialog*/

function StoryMap(options) {

	const _defaultOptions = {

		language: "en",
		maxSlides: 10,
		strings: {
			en: {
				maxSlides: "Maximum number of slides reached",
				publish: "<b>To edit go to:</b> <a target='_blank' href='<<edit>>'><<edit>></a> <br><br><b>To view go to:</b> <a target='_blank' href='<<view>>'><<view>></a>",
				delete: "Delete \"<<name>>\" slide?",
			},
			ca: {
				maxSlides: "Màxim número de slides assolit",
				publish: "<b>Per editar vés a:</b> <a target='_blank' href='<<edit>>'><<edit>></a> <br><br><b>Per veure vés a:</b> <a target='_blank' href='<<view>>'><<view>></a>",
				delete: "Elimina la diapositiva \"<<name>>\"?",
			},
			es: {
				maxSlides: "Has llegado al número máximo de slides",
				publish: "<b>Para editar ve a:</b> <a target='_blank' href='<<edit>>'><<edit>></a> <br><br><b>Para ver ve a:</b> <a target='_blank' href='<<view>>'><<view>></a>",
				delete: "Elimina la diapositiva \"<<name>>\"?",
			},
		},
		editorURL: "https://www.instamaps.cat/storymap/editor.html",
		viewerURL: "https://www.instamaps.cat/storymap/visor.html",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);

	this.isDirty = false;
	this.currentDeletionIndex = -1;
	this.currentSelectedIndex = -1;
	this.slides = [];
	this.idEditor = "";
	this.idStoryMap = "";
	this.slideBar = new SlideBar();
	this.slideInfoPanel = new SlideInfo();
	this.deleteDialog = new Dialog();
	this.maxSlidesDialog = new Dialog({ showCancelButton: false });
	this.maxSlidesDialog.setMessage(this.options.strings[this.options.language].maxSlides);
	this.publishDialog = new Dialog({ showCancelButton: false });
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
	const slide = this.createSlideData(this.slides.length, this.slideInfoPanel.getURL(),
		this.slideInfoPanel.getTitol(), this.slideInfoPanel.getDescripcio());

	this.slideBar.setSlideTitle(slide.titol);
	this.slides[this.currentSelectedIndex] = slide;
	this.isDirty = true;

	// Guardem les dades al servidor
	this.save().then(() => {

		this.slideInfoPanel.saved();

	});

};

StoryMap.prototype.createSlideData = function (id, url, titol, descripcio) {

	const slideId = id || -1;
	const slideURL = url || "";
	const slideTitol = titol || "";
	const slideDesc = descripcio || "";

	const data = {
		id: slideId,
		url_mapa: slideURL,
		titol: slideTitol,
		descripcio: slideDesc,
	};

	return data;

};

StoryMap.prototype._addSlide = function () {

	const self = this;

	const n = self.slides.length;
	if (n === self.options.maxSlides) {

		self.maxSlidesDialog.show();

	}	else {

		const slide = self.createSlideData(n);
		self.slides.push(slide);
		this.slideBar.addSlide();
		$(self).trigger("StoryMap:changed");

	}

};

StoryMap.prototype._slideSelected = function (index) {

	if (this.slides != null) {

		this.currentSelectedIndex = index;
		const currentSlide = this.slides[index];
		this.slideInfoPanel.setData(currentSlide.url_mapa, currentSlide.titol, currentSlide.descripcio);
		this.slideInfoPanel.open();

	}

};

StoryMap.prototype._slideDeletePressed = function (index) {

	const data = this.slides[index];
	const slideTitle = (data.titol || "(untitled)");

	this.deleteDialog.setMessage(this.options.strings[this.options.language].delete
		.replace("<<name>>", slideTitle));
	this.deleteDialog.show();

};

StoryMap.prototype.save = function () {

	const deferred = $.Deferred();

	if (!this.isDirty) {

		deferred.resolve();

	} else if (this.idStoryMap !== "") {

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

			this.server.updateMapSlides(this.idEditor, this.idStoryMap,
				JSON.stringify(this.slides)).then(

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

	const self = this;

	self.idEditor = id;

	self.server.editMapSlides(id).then((results) => {

		self.isDirty = false;
		self.idStoryMap = results.id;
		self.slides = JSON.parse(results.slides);
		self.slideBar.clear();
		self.slideBar.addSlides(self.slides);

	});

};

StoryMap.prototype._slideDeleteConfirmed = function () {

	const self = this;

	self.isDirty = true;
	self.slides.splice(this.currentDeletionIndex, 1);
	self.slideBar.removeSlide(this.currentDeletionIndex);

};

StoryMap.prototype.publish = function () {

	const urlEditor = `${this.options.editorURL}?id=${this.idEditor}`;
	const urlVisor = `${this.options.viewerURL}?id=${this.idStoryMap}`;
	let message = this.options.strings[this.options.language].publish;
	message = message.replace(/<<edit>>/g, urlEditor);
	message = message.replace(/<<view>>/g, urlVisor);

	this.publishDialog.setMessage(message);
	this.publishDialog.show();

};
