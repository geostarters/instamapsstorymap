/* global $, SlideBar, SlideInfo, StoryMapServer, Dialog, Loader*/

function StoryMap(options) {

	const _defaultOptions = {

		language: "en",
		maxSlides: 12,
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
		editorURL: "http://betaserver2.icgc.cat/storymap/html/editor.html",
		viewerURL: "http://betaserver2.icgc.cat/storymap/html/visor.html",
		titleId: "#storyMapTitle",

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
	this.loader = new Loader();

	this.addEvents();
	this._addSlide();

}

StoryMap.prototype.addEvents = function () {

	const self = this;

	$(self.slideBar).on("SlideBar:saveStorymapPressed", () => {

		self._updateCurrentSlideData();
		self.loader.setTitle("Guardant l'Storymap");
		self.loader.show();

		self.save().then(() => {

			self.loader.hide();
			self.publish();

		});

	});

	$(self.slideBar).on("SlideBar:slideSelected", (event, id) => {

		// Get the data from the info panel and add it to the current slide
		self._updateCurrentSlideData();
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
		self.currentDeletionIndex = -1;

	});

	$(self.deleteDialog).on("Dialog:cancel", () => {

		self.currentDeletionIndex = -1;

	});

};

StoryMap.prototype.createSlideData = function (id, url, titol, descripcio) {

	const slideId = (id === undefined) ? -1 : id;
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

	if (this.slides !== null) {

		this.currentSelectedIndex = index;
		const currentSlide = this.slides[index];
		this.slideInfoPanel.setData(currentSlide.url_mapa, currentSlide.titol, currentSlide.descripcio);
		this.slideInfoPanel.open();

	}

};

StoryMap.prototype._updateCurrentSlideData = function () {

	if (this.slides !== null) {

		if (this.currentSelectedIndex !== -1) {

			const currentSlide = this.slides[this.currentSelectedIndex];
			const url = this.slideInfoPanel.getURL();

			if (url.trim() !== "") {

				currentSlide.url_mapa = this.slideInfoPanel.getURL();
				currentSlide.titol = this.slideInfoPanel.getTitol();
				currentSlide.descripcio = this.slideInfoPanel.getDescripcio();
				this.slideBar.setSlideTitle(currentSlide.titol);
				this.isDirty = true;

			}

		}

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
	const storymapData = {
		title: $(this.options.titleId).val(),
		overlappingMode: this.slideInfoPanel.getOverlappingMode(),
		animationOptions: {
			isAnimated: this.slideInfoPanel.isAnimated(),
			timeBetweenSlides: this.slideInfoPanel.getTimeBetweenSlides(),
			pauseOnHover: this.slideInfoPanel.shouldPauseOnHover(),
			startOnLoad: this.slideInfoPanel.shouldStartOnLoad(),
			animOnFirst: this.slideInfoPanel.shouldAnimOnFirstSlide(),
			loop: this.slideInfoPanel.shouldLoop(),
		},
		slides: this.slides,
	};

	if (this.idStoryMap !== "") {

		if (this.idEditor === "") {

			// ja existeix l'storymap creat. Entrem en mode edició
			this.server.editMapSlides(this.idStoryMap).then(function (results) {

				this.idEditor = results.id_editor;

				this.server.updateMapSlides(this.idEditor, this.idStoryMap,
					JSON.stringify(storymapData)).then(

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
				JSON.stringify(storymapData)).then(

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
		this.server.newMapSlides(JSON.stringify(storymapData)).then((results) => {

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
	self.loader.setTitle("Carregant l'Storymap");
	self.loader.show();

	self.server.editMapSlides(id).then((results) => {

		self.isDirty = false;
		self.idStoryMap = results.id;
		const data = JSON.parse(results.slides);
		self.slides = data.slides;
		self.slideBar.clear();
		self.slideBar.addSlides(self.slides);
		self.slideInfoPanel.setOverlappingMode(data.overlappingMode);
		self.slideInfoPanel.setIsAnimated(data.animationOptions.isAnimated);
		self.slideInfoPanel.setTimeBetweenSlides(data.animationOptions.timeBetweenSlides);
		self.slideInfoPanel.setPauseOnHover(data.animationOptions.pauseOnHover);
		self.slideInfoPanel.setStartOnLoad(data.animationOptions.startOnLoad);
		self.slideInfoPanel.setAnimOnFirstSlide(data.animationOptions.animOnFirst);
		self.slideInfoPanel.setLoop(data.animationOptions.loop);
		$(self.options.titleId).val(data.title);

		self.loader.hide();

	});

};

StoryMap.prototype._slideDeleteConfirmed = function () {

	const self = this;

	self.isDirty = true;
	self.slides.splice(this.currentDeletionIndex, 1);
	self.slideBar.removeSlide(this.currentDeletionIndex);
	self.slideInfoPanel.clean();

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
