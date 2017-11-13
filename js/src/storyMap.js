/* global _, $, SlideBar, SlideInfo, StoryMapServer, Dialog, Loader, window*/

/**
*	Constructs a StoryMap
*	@param {Object} options An object containing the following properties
*	@property {String} language The language identifier
*	@property {Number} maxSlides The maximum number of slides in the storymap
*	@property {Object} strings An object with the translations
*	@property {String} editorURL A string with the URL where the user should be pointed at to edit
*	the story map when it's published
*	@property {String} viewerURL A string with the URL where the user should be pointed at to view
*	the story map when it's published
*	@property {String} titleId The DOM node identifier where the story map title must be set
*/
function StoryMap(options) {

	const _defaultOptions = {

		language: "en",
		maxSlides: 12,
		strings: {
			en: {
				maxSlides: "Maximum number of slides reached",
				delete: "Delete \"<<name>>\" slide?",
				loading: "Loading StoryMap",
				toSeeAndShareText: "To see and share this storymap use this link:",
				toEditText: "If you want to keep working on it or change it some time use this link:",
				rememberText: "Remember this links as, for now, they can't be retrieved later",
				sendByEmailText: "If you want we can send it by email:",
				emailButtonText: "Send it!",
			},
			ca: {
				maxSlides: "Màxim número de slides assolit",
				delete: "Elimina la diapositiva \"<<name>>\"?",
				loading: "Carregant l'StoryMap",
				toSeeAndShareText: "Per veure i compartir aquest storymap empra l’enllaç:",
				toEditText: "Si vols seguir-hi treballant o fer canvis més endavant empra aquest altre enllaç:",
				rememberText: "Recorda desar aquests enllaços, ja que ara per ara no es podran recuperar quan tanquis aquesta finestra.",
				sendByEmailText: "Si vols els pots enviar per correu:",
				emailButtonText: "Envia'ls",
			},
			es: {
				maxSlides: "Has llegado al número máximo de slides",
				delete: "Elimina la diapositiva \"<<name>>\"?",
				loading: "Cargando el StoryMap",
				toSeeAndShareText: "Para ver y compartir este storymap usa el siguiente enlace:",
				toEditText: "Si quieres seguir trabajando o hacer cambios mas adelante usa ese enlace:",
				rememberText: "Recuerda guardar estos enlaces ya que por ahora no se pueden recuperar.",
				sendByEmailText: "Si quieres los puedes enviar por correo:",
				emailButtonText: "Envialos",
			},
		},
		editorURL: "http://betaserver2.icgc.cat/storymap/html/editor.html",
		viewerURL: "http://betaserver2.icgc.cat/storymap/html/visor.html",
		titleId: "#storyMapTitle",
		publishDialogTemplate: "#publish_map_template",
		sendEmailButtonId: "#sendEmailBtn",

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
	this.publishTemplate = $(this.options.publishDialogTemplate).html().trim();
	this.sendEmailButton = $(this.options.sendEmailButtonId);

	this.addEvents();
	this._addSlide();

}

/**
*	Adds the events the story map should respond to
*	@access private
*/
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
		self._showDeleteDialog(id);

	});

	$(self.slideBar).on("SlideBar:slideMoved", (event, startPos, endPos) => {

		const tempSlide = this.slides[startPos];
		this.slides.splice(startPos, 1);
		this.slides.splice(endPos, 0, tempSlide);

		if (this.currentSelectedIndex === startPos) {

			this.currentSelectedIndex = endPos;

		}

	});

	$(self.deleteDialog).on("Dialog:accept", () => {

		self._deleteSlide();
		self.currentDeletionIndex = -1;

	});

	$(self.deleteDialog).on("Dialog:cancel", () => {

		self.currentDeletionIndex = -1;

	});

};

/**
*	Creates a slide data object
*	@param {Number} id The slide identifier
*	@param {string} url The url the slide should open
*	@param {string} title The slide title
*	@param {string} description The slide description
*	@access private
*/
StoryMap.prototype.createSlideData = function (id, url, title, description) {

	const slideId = (id === undefined) ? -1 : id;
	const slideURL = url || "";
	const slideTitol = title || "";
	const slideDesc = description || "";

	const data = {
		id: slideId,
		url_mapa: slideURL,
		titol: slideTitol,
		descripcio: slideDesc,
	};

	return data;

};

/**
*	Adds a slide to the story map if we haven't reached the maximum number
*	@access private
*/
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

/**
*	Selects an slide and loads its data into the info panel
*	@param {number} index The slide index
*	@access private
*/
StoryMap.prototype._slideSelected = function (index) {

	if (this.slides !== null) {

		this.currentSelectedIndex = index;
		const currentSlide = this.slides[index];
		this.slideInfoPanel.setData(currentSlide.url_mapa, currentSlide.titol, currentSlide.descripcio);
		this.slideInfoPanel.open();

	}

};

/**
*	Updates the slide data with the data found in the info panel
*	@access private
*/
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

/**
*	Shows a delete confirmation modal with the slide title on it
*	@param {number} index The slide index
*	@access private
*/
StoryMap.prototype._showDeleteDialog = function (index) {

	const data = this.slides[index];
	const slideTitle = (data.titol || "(untitled)");

	this.deleteDialog.setMessage(this.options.strings[this.options.language].delete
		.replace("<<name>>", slideTitle));
	this.deleteDialog.show();

};

/**
*	Pushes the story map to the server
*	@access public
*/
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

			// Story map already exist, go into edit mode
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

		// Story map doesn't exist, build a new one with the current information
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

/**
*	Deletes the slide selected to delete removing its icon from the slide bar and its info from
*	the info panel
*	@access private
*/
StoryMap.prototype._deleteSlide = function () {

	const self = this;

	self.isDirty = true;
	self.slides.splice(this.currentDeletionIndex, 1);
	self.slideBar.removeSlide(this.currentDeletionIndex);
	self.slideInfoPanel.clean();

};

/**
*	Loads a story map from the server and inits the editor components
*	@param {string} id A story map identifier
*	@access public
*/
StoryMap.prototype.load = function (id) {

	const self = this;

	self.idEditor = id;
	self.loader.setTitle(this.options.strings[this.options.language].loading);
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

/**
*	Shows the publish dialog with the URLs to edit and to view the current storymap
*	@access public
*/
StoryMap.prototype.publish = function () {

	const self = this;

	const urlEditor = `${self.options.editorURL}?id=${self.idEditor}`;
	const urlVisor = `${self.options.viewerURL}?id=${self.idStoryMap}`;
	const currentLanguage = self.options.strings[self.options.language];
	const mailBody = `${currentLanguage.toSeeAndShareText}%0D%0A
		${urlVisor}%0D%0A
		%0D%0A
		${currentLanguage.toEditText}%0D%0A
		%0D%0A
		${urlEditor}`;

	const message = _.template(self.publishTemplate, {
		lang: self.options.strings[self.options.language],
		viewLink: urlVisor,
		editLink: urlEditor,
	});

	self.publishDialog.setMessage(message);
	self.publishDialog.show();

	$(self.options.sendEmailButtonId).on("click", () => {

		window.open(`mailto:?subject=Enllaços Storymap ${$(this.options.titleId).val()}.&body=${mailBody}`, "_self");

	});

};
