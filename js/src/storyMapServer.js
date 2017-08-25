/* global $*/

function StoryMapServer(options) {

	const _defaultOptions = {

		urlStoryMap: "http://172.70.1.32/storymaps/",

	};

	this.options = $.extend(true, {}, _defaultOptions, options);

}

StoryMapServer.prototype.getMapSlides = function (idMapa) {

	// Example: http://172.70.1.32/storymaps/768ddc60-66e2-11e7-af5e-09aff007230d
	return $.ajax({

		method: "GET",
		url: this.options.urlStoryMap + idMapa,

	});

};

StoryMapServer.prototype.editMapSlides = function (idMapaEditing) {

	// Example: http://172.70.1.32/storymaps/edit/76d21f00-48e0-4216-bb52-84a8a41cc6a2
	return $.ajax({

		method: "GET",
		url: `${this.options.urlStoryMap}edit/${idMapaEditing}`,
		async: false,

	}).responseText;

};
StoryMapServer.prototype.newMapSlides = function (jsonSlides) {

	// http://172.70.1.32/storymaps/edit/
	return $.ajax({

		method: "POST",
		url: `${this.options.urlStoryMap}edit/`,
		dataType: "json",
		data: { id: 0, id_editor: 0, slides: jsonSlides },

	});

};


StoryMapServer.prototype.updateMapSlides = function (idMapaEditing, idMapa, jsonSlides) {

	return $.ajax({

		method: "PUT",
		url: `${this.options.urlStoryMap}edit/${idMapaEditing}`,
		dataType: "json",
		data: { id: idMapa, id_editor: idMapaEditing, slides: jsonSlides },

	});

};

StoryMapServer.prototype.deleteMapSlides = function (idMapaEditing, idMapa) {

	$.ajax({

		method: "DELETE",
		url: `${this.options.urlStoryMap}edit/${idMapaEditing}/${idMapa}`,
		contentType: "application/json",

	})
		.done(() => {

		});

};
