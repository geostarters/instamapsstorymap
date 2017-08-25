/* global $, alert, SlideBar, SlideInfo, StoryMapServer*/

function StoryMap(options) {

	const _defaultOptions = {

		language: "en",
		slideIconRegex: /^slide-icon-\w+$/,
		slideTemplate: "#storymap_slide_template",
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

	this._currentSlideIndex = -1;
	this._storyMapData = null;
	this.slides = null;
	this.idEditor = "";
	this.idStoryMap = "";
	this.slideBar = new SlideBar();
	this.slideInfoPanel = new SlideInfo();
	this.server = new StoryMapServer();

	this.addEvents();

}

StoryMap.prototype.addEvents = function () {

	const self = this;

	$(self.slideInfoPanel).on("SlideInfo:saveSlidePressed", () => {

		self.saveSlide();

	});

};

StoryMap.prototype.saveSlide = function () {

	// Agafar les dades de l'slideInfoPanel i guardar-les a l'objecte de l'slide
	const slide = {
		id: this.slides.length,
		url_mapa: this.slideInfoPanel.getURL(),
		titol: this.slideInfoPanel.getTitol(),
		descripcio: this.slideInfoPanel.getDescricio(),
	};

	this.slides.push(slide);

	// Guardem les dades al servidor
	this.save().then(() => {

		this.slideInfoPanel.reset();

	});

};

StoryMap.prototype.addSlide = function () {

	const defaultData = $.extend(true, {}, this.options.slideData);
	const n = this._slides.length;
	if (n === this.options.maxSlides) {

		alert(this.options.strings[this.options.language].maxSlides);

	}	else {

		this._slides.push(defaultData);
		$(this).trigger("StoryMap:changed");
		const slide = this.slideBar.addSlide(defaultData);
		slide.on("SlideBar:slideSelected", this._slideSelected);
		slide.on("SlideBar:deleteSlidePressed", this._slideDeletePressed);

	}

};

StoryMap.prototype._slideSelected = function (event, index) {

	if (this.slides != null) {

		const currentSlide = this.slides[index];

		// TODO: Passar a l'SlideInfo
		alert(currentSlide);

	}

};

StoryMap.prototype._slideDeletePressed = function (event, index) {

	const data = this._slides[index];
	const slideTitle = ((data.text) ? (data.text.headline || "(untitled)") : "(untitled)");

	this.showConfirm(`Delete "${slideTitle}" slide?`, this.options.slideElem, index);

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

StoryMap.prototype.show_confirm = function () { /* (msg, slideElem, slideIndex) {

	const modal = document.getElementById("dialog_delete_slide");
	$("#msg").html(`<span>${msg}</span>`);
	modal.style.display = "block";

	$("#dialog_delete_slide .btn-default").on("click", () => {

		modal = document.getElementById("dialog_delete_slide");
		modal.style.display = "none";

		const height = $("#slides").height() - slideElem.outerHeight(true);

		// Delete the slide data
		_slides.splice(slideIndex, 1);
		storymap_dirty(1);

		// Remove DOM element
		slideElem.remove();

		// Adjust slide container height
		$("#slides").css("height", `${height}px`);

		if(_current_slide_index == 0) {

			// Update overlay view
		   // _map.removeMarker(slideIndex - 1);

		} else {

			// Reset current slide
			if(slideIndex < _current_slide_index) {

				_current_slide_index--;
				//storymap_auto_save();

			} else if(slideIndex == _current_slide_index) {

				const n = Math.min(_current_slide_index, _slides.length - 1);
				$(".slide").eq(n).click();

			}

		}

	});
	
	$("#dialog_delete_slide .close").on("click", () => {

		modal = document.getElementById("dialog_delete_slide");
		modal.style.display = "none";

	});
	
	$("#dialog_delete_slide .btn-danger").on("click", () => {

		modal = document.getElementById("dialog_delete_slide");
		modal.style.display = "none";

	});*/

};
