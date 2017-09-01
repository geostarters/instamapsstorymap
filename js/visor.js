jQuery(document).ready(function() {
	/* $(".regular").slick({
	  	   infinite: true,
	         fade: true,
	         speed: 500,
	         cssEase: 'linear'
	    });*/
	var id = url('?id') || null;
	if (id != null) {//Comprovem id mapa visor per carregar slides
		
		loadVisor(id);

	}

		
});

function loadVisor(idVisor) {
		var server = new StoryMapServer();
		server.getMapSlides(idVisor).then((results) => {
			var slides;
			try{
				slides=JSON.parse(results.slides);
			}catch(e){
				slides = results.slides;
			}
			var html="";
			for (index in slides){
				var slide = slides[index];
				var template =  $('#storymap_slide_template').html();;
				var data =   {text: slide.titol, url: slide.url_mapa, descripcio: slide.descripcio};
				var parsedTemplate = _.template(template,  data );
				html += parsedTemplate;
				
			}
			$('.carousel-inner').html(html);
			$('.carousel-inner').children().first().addClass('active');
		});

}