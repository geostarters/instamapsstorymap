/* global $*/

/**
*	Constructs a StoryMap server
*	@param {Object} options An object containing the following properties
*	@property {string} urlStoryMap The URL where the server lives on
*/
function StoryMapServer(options) {

	const _defaultOptions = {

		urlStoryMap: "http://betaserver2.icgc.cat/storymaps/",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);

}

/**
*	Gets the slides from a story map in view mode
*	@param {String} idStoryMap The story map identifier
*	@returns {Promise} A promise resolving the server call
*/
StoryMapServer.prototype.getMapSlides = function (idStoryMap) {

	// Example: http://172.70.1.32/storymaps/768ddc60-66e2-11e7-af5e-09aff007230d
	return $.ajax({

		method: "GET",
		url: this.options.urlStoryMap + idStoryMap,

	});

};

/**
*	Gets the slides from a story map in edit mode
*	@param {String} idStoryMap The story map identifier
*	@returns {Promise} A promise resolving the server call
*/
StoryMapServer.prototype.editMapSlides = function (idStoryMap) {

	// Example: http://172.70.1.32/storymaps/edit/76d21f00-48e0-4216-bb52-84a8a41cc6a2
	return $.ajax({

		method: "GET",
		url: `${this.options.urlStoryMap}edit/${idStoryMap}`,

	});

};

/**
*	Pushes slides to the server creating a new story map
*	@param {String} jsonSlides A JSON-encoded string with the story map data
*	@returns {Promise} A promise resolving the server call
*/
StoryMapServer.prototype.newMapSlides = function (jsonSlides) {

	// http://172.70.1.32/storymaps/edit/
	return $.ajax({

		method: "POST",
		url: `${this.options.urlStoryMap}edit/`,
		dataType: "json",
		data: { id: 0, id_editor: 0, slides: jsonSlides },

	});

};

/**
*	Pushes slides to the server editing a story map
*	@param {String} idEditStoryMap The edit mode story map identifier
*	@param {String} idViewStoryMap The view mode story map identifier
*	@param {String} jsonSlides A JSON-encoded string with the story map data
*	@returns {Promise} A promise resolving the server call
*/
StoryMapServer.prototype.updateMapSlides = function (idEditStoryMap, idViewStoryMap, jsonSlides) {

	return $.ajax({

		method: "PUT",
		url: `${this.options.urlStoryMap}edit/${idEditStoryMap}`,
		dataType: "json",
		data: { id: idViewStoryMap, id_editor: idEditStoryMap, slides: jsonSlides },

	});

};

/**
*	Deletes a story map
*	@param {String} idEditStoryMap The edit mode story map identifier
*	@param {String} idViewStoryMap The view mode story map identifier
*	@returns {Promise} A promise resolving the server call
*/
StoryMapServer.prototype.deleteMapSlides = function (idEditStoryMap, idViewStoryMap) {

	return $.ajax({

		method: "DELETE",
		url: `${this.options.urlStoryMap}edit/${idEditStoryMap}/${idViewStoryMap}`,
		contentType: "application/json",

	});

};
