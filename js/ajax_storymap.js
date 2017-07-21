var urlStoryMap = "http://172.70.1.32/storymaps/"; 
function getMapSlides(idMapa){
	//Example: http://172.70.1.32/storymaps/768ddc60-66e2-11e7-af5e-09aff007230d
	return $.ajax({
		  method: "GET",
		  url: urlStoryMap+idMapa
		});
		
}
function editMapSlides(idMapaEditing){
	//Example: http://172.70.1.32/storymaps/76d21f00-48e0-4216-bb52-84a8a41cc6a2
	return $.ajax({
		  method: "GET",
		  url: urlStoryMap+"edit/"+idMapaEditing,   
          async: false
    }).responseText;

}
function newMapSlides(jsonSlides){
	//http://172.70.1.32/storymaps/edit/
	return $.ajax({
		  method: "POST",
		  url: urlStoryMap+"edit/",
		  dataType: 'json',
		  data: { id:0, id_editor:0, slides: jsonSlides}
		});
	/*	  .done(function( msg ) {
		    console.debug(msg );
		  });*/
}


function updateMapSlides(idMapaEditing, idMapa,jsonSlides){
	return $.ajax({
		  method: "PUT",
		  url: urlStoryMap+"edit/"+idMapaEditing,
		  dataType: 'json',
		  data: { id:idMapa, id_editor:idMapaEditing, slides: jsonSlides}
	});
}

function deleteMapSlides(idMapaEditing,idMapa){
	$.ajax({
		  method: "DELETE",
		  url: urlStoryMap+"edit/"+idMapaEditing+"/"+idMapa,
		  contentType: 'application/json'
		})
		  .done(function( msg ) {
		    console.debug( msg );
		  });
}

function testNode(){
	var slides="[{\"id\": 1,\"url_mapa\": \"\",\"titol\": \"test2\",\"descripcio\": \"\",\"imatge\": \"\"},{\"id\": 2,\"url_mapa\": \"\",\"titol\": \"test5\",\"descripcio\": \"\",\"imatge\": \"\"}]";
	//getMapSlides("768ddc60-66e2-11e7-af5e-09aff007230d");
	//editMapSlides("76d21f00-48e0-4216-bb52-84a8a41cc6a2");
	//newMapSlides(JSON.stringify(slides));
	//updateMapSlides("76d21f00-48e0-4216-bb52-84a8a41cc6a2","768ddc60-66e2-11e7-af5e-09aff007230d",slides);
	//getMapSlides("d7139d30-6887-11e7-86f3-89afdd5a3d46");
	//deleteMapSlides("12345","2");
}

