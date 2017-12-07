jQuery(document).ready(function() {

	var id = url('?id') || null;
	if (id != null) {//Comprovem id mapa visor per carregar slides
		
		loadVisor(id);

	}
		
});

var currentSlide = 0;
var maxSlides = 0;
var shouldWrap = false;
var isIndicatorClicked = false;

function loadVisor(idVisor) {

	var server = new StoryMapServer();
	server.getMapSlides(idVisor).then(function(results) {

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
	var indicators = "";
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
		indicators += "<li data-target=\"#myCarousel\" data-slide-to=\"" + index + "\" class=\"indicator " + (index==0? "active" : "") + "\"></li>";
		
	}

	$('.carousel-indicators').html(indicators);
	$('.carousel-inner').html(html);
	$('.carousel-inner').children().first().addClass('active');
	$('#storyMapTitle').html(serverData.title);

	$('.indicator').click(function() {

		var target = $(this).data('target');
		var slideTo = $(this).data('slide-to');

		currentSlide = slideTo;
		isIndicatorClicked = true;
		$(target).carousel(slideTo);

	});

}

function addProtocolIfNeeded(url) {

	var newURL = url;
	var expression = /(?:https?:\/\/)/gi;
	var regex = new RegExp(expression);

	if (!regex.test(url)) {

		newURL = 'http://' + newURL;

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

	$("#fullScreenButton").on("click", function() {

		var el = document.documentElement;
		var rfs = el.requestFullscreen
        || el.webkitRequestFullScreen
        || el.mozRequestFullScreen
        || el.msRequestFullscreen;

		rfs.call(el);

	});

	document.addEventListener('webkitfullscreenchange', fullScreenHandler, false);
    document.addEventListener('mozfullscreenchange', fullScreenHandler, false);
    document.addEventListener('fullscreenchange', fullScreenHandler, false);
    document.addEventListener('MSFullscreenChange', fullScreenHandler, false);

	$("#share-modal .close").on("click", function() {

		$("#share-modal").modal('hide');

	});

	$("#leftArrow").on("click", function() {

		$("#myCarousel").carousel('prev');

	});

	$("#rightArrow").on("click", function() {

		$("#myCarousel").carousel('next');

	});

	$("#myCarousel").on('slide.bs.carousel', function(event) {

		if(isIndicatorClicked) {

			isIndicatorClicked = false;

		}
		else {

			if(event.direction === "right")
				currentSlide--;
			else if(event.direction === "left")
				currentSlide++;

		}

		updateArrows();
		updateIndicators();

	});

	$(document).on("keyup", function(event) {

		if(event.keyCode == '37') {

			if(canGoLeft()) {

				$("#myCarousel").carousel('prev');

			}

		} else if(event.keyCode == '39') {

			if(canGoRight()) {

				$("#myCarousel").carousel('next');
				
			}

		}

	});

}

function fullScreenHandler() {

	if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement === true)
	{

		enableFullScreen();

	} else {
		disableFullScreen();
	}

}

function enableFullScreen() {

	$('header').hide();
	$('footer').hide();
	$('.footer-controls-wrapper').hide();
	$('.dataSection-visor').css('top', '0px');
	$('.dataSection-visor').css('bottom', '0px');
	$('.mapaFrame-visor').css('top', '0px');
	$('.mapaFrame-visor').css('bottom', '0px');

}

function disableFullScreen() {

	$('header').show();
	$('footer').show();
	$('.footer-controls-wrapper').show();
	$('.dataSection-visor').css('top', '64px');
	$('.dataSection-visor').css('bottom', '42px');
	$('.mapaFrame-visor').css('top', '64px');
	$('.mapaFrame-visor').css('bottom', '42px');

}

function updateArrows() {

	if(!canGoLeft())
		$("#leftArrow").hide();
	else
		$("#leftArrow").show();

	if(!canGoRight())
		$("#rightArrow").hide();
	else
		$("#rightArrow").show();

}

function updateIndicators() {

	$('.indicator').removeClass("active");
	$('.indicator:nth-child(' + (currentSlide+1) + ')').addClass("active");

}

function canGoLeft() {

	return currentSlide != 0 || shouldWrap;

}

function canGoRight() {

	return (currentSlide != maxSlides-1) || shouldWrap;

}
