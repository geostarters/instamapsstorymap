jQuery(document).ready(function() {

	var id = url('?id') || null;
	if (id != null) {//Comprovem id mapa visor per carregar slides
		
		loadVisor(id);

	}
		
});

var currentSlide = 0;
var maxSlides = 0;
var shouldWrap = false;

function loadVisor(idVisor) {

	var server = new StoryMapServer();
	server.getMapSlides(idVisor).then((results) => {

		var serverData;
		try {

			serverData = JSON.parse(results.slides);

		} catch(e) {

			serverData = results.slides;

		}

		initCarouselContents(serverData);
		buildShareLinks(serverData);
		addEvents();

		initStorymap(serverData);

	});

}

function initStorymap(serverData) {

	var animOptions = serverData.animationOptions;
	$("#myCarousel").carousel({
		interval: (!animOptions.isAnimated) ? false : parseInt(animOptions.timeBetweenSlides) * 1000,
		pause: (!animOptions.pauseOnHover) ? "hover" : null,
		ride: (!animOptions.startOnLoad) ? "carousel" : animOptions.animOnFirst,
		wrap: animOptions.loop,
	});

	currentSlide = 0;
	maxSlides = serverData.slides.length;
	shouldWrap = animOptions.loop;

	if(maxSlides != 1) {

		$('#rightArrow').show();

		if(shouldWrap)
			$('#leftArrow').show();

	}

}

function initCarouselContents(serverData) {

	var html="";
	for (index in serverData.slides) {

		var slide = serverData.slides[index];
		var template =  $('#storymap_slide_template').html();
		var data =   {
			text: slide.titol, 
			url: addProtocolIfNeeded(slide.url_mapa), 
			descripcio: slide.descripcio,
			iframeClass: (serverData.overlappingMode === "noOverlapped") ? "collapsed" : "expanded",
		};
		var parsedTemplate = _.template(template,  data );
		html += parsedTemplate;
		
	}

	$('.carousel-inner').html(html);
	$('.carousel-inner').children().first().addClass('active');
	$('#storyMapTitle').html(serverData.title);

}

function addProtocolIfNeeded(url) {

	let newURL = url;
	const expression = /(?:https?:\/\/)/gi;
	const regex = new RegExp(expression);

	if (!regex.test(url)) {

		newURL = `http://${newURL}`;

	}

	return newURL;

}

function buildShareLinks(data) {

	var baseURL = 'http://betaserver2.icgc.cat/storymap/html/visor.html';
	var visorLink = baseURL + "?id=" + url("?id");
	var mailtoLink = "mailto:?subject=StoryMap&body=" + data.title + " - " + visorLink;
	var fbLink = "https://www.facebook.com/dialog/share_open_graph?app_id=620717167980164&display=popup&redirect_uri=http://www.instamaps.cat/geocatweb/galeria.html&action_type=og.likes&action_properties={\"object\":\"" + visorLink + "\"}";
	var plusLink = "https://plusone.google.com/_/+1/confirm?hl=en&url=" + visorLink;
	var twitterLink = "https://twitter.com/share?url=" + visorLink + "&text=" + data.title;
	var lkdLink = "http://www.linkedin.com/shareArticle?mini=true&url=" + visorLink + "&title=" + data.title + "&source=in1.com";
	var pinterestLink = "http://pinterest.com/pin/create/button/?url=" + visorLink + "&media=&description=" + data.title;

	$('a[data-type="email"]').attr("href", mailtoLink);
	$('a[data-type="facebook"]').attr("href", fbLink);
	$('a[data-type="googleplus"]').attr("href", plusLink);
	$('a[data-type="twitter"]').attr("href", twitterLink);
	$('a[data-type="linkedin"]').attr("href", lkdLink);
	$('a[data-type="pinterest"]').attr("href", pinterestLink);

}

function addEvents() {

	$("#share-modal .close").on("click", () => {

		$("#share-modal").modal('hide');

	});

	$("#leftArrow").on("click", () => {

		$('#rightArrow').show();
		$("#myCarousel").carousel('prev');
		currentSlide--;

		if(currentSlide == 0 && !shouldWrap)
			$("#leftArrow").hide();

	});

	$("#rightArrow").on("click", () => {

		$('#leftArrow').show();
		$("#myCarousel").carousel('next');
		currentSlide++;

		if((currentSlide == maxSlides-1) && !shouldWrap)
			$("#rightArrow").hide();

	});

}
