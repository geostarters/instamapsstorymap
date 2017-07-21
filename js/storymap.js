var _default_data = {
	    width: "100%",
	    height: "800",
	    font_css: '',
	    storymap: {
	        language: "en",
	        map_type: "stamen:toner-lite",
	        map_subdomains: "",
	        map_access_token: "",
	        map_background_color: '#ffffff',
	        // just one...
	        slide: {
	            date: "",
	            text: {headline: "", text: ""},
	            media: {url: "", credit: "", caption: ""},
	            location: {
	                line: true
	            }
	        }
	    }
	};

var _storymap_data;
var _current_slide_index = -1;
var _slides=null;
var _slidesServidor=null;

var _re_slide_cls = /^slide-icon-\w+$/;
var storymap_slide_template = _.template($("#storymap_slide_template").html().trim());
jQuery(document).ready(function() {
	eventsButtons();
	// Create StorySlider
	_slides = $('#slides');
	var id= url('#id') || null;
	if (id!=null){//Comprovem id mapa editor per carregar slides
		var jsonSlides = editMapSlides(id);
		console.debug(jsonSlides);
	}
	else _slidesServidor=null;
	$('#summernote').summernote();
	$('#storymap_add_slide').click();
});



function eventsButtons(){
	
	$('#storymap_load').on('click', function(event){
		var loc=document.getElementById('urlMap').value;
		document.getElementById('instamapsMap').src = loc;
	});
	$('#storymap_unload').on('click', function(event){
		document.getElementById('urlMap').value='';
		document.getElementById('instamapsMap').src = 'https://www.instamaps.cat/geocatweb/visor.html';
	});
	
	$('#obrir_menu').on('click', function(event){
			var style = $('#mapaFrame').attr("style");
			if (style.indexOf("65%")>-1) {
				$('#mapaFrame').attr('style','height:100%;width:100%;float:left');
				$('.data-section').attr('style','display:none;');
			}
			else {
				$('#mapaFrame').attr('style','height:100%;width:65%;float:left');
				$('.data-section').attr('style','');
			}
	});
	
	 $('#storymap_add_slide').click(function(event) {
	         slide_add();	         
	         clear_div_map();
	 });
	 
	 $('#storymap_save_slide').click(function(event){
		 //Salvar tota la info del slide amb el servei de node
		 if ($('#idEditor').val()!='' & $('#idStoryMap').val()!='' ){ //ja existeix l'storymap creat. Cal recuperar la info i modificar-la 
			 var idMapaEditing=$('#idEditor').val();
			 var idMapa=$('#idStoryMap').val();
			 editMapSlides(idMapaEditing).then(function(results){
				 var editMapJson =results;
				 console.debug(editMapJson);
				 var slide={
							id:$('#slide_index').val(),
							url_mapa:$('#urlMap').val(),
							titol:$('#headline').val(),
							descripcio:$('#summernote').summernote('code')
				 };
				 var slides =$.parseJSON(editMapJson.slides);
				 slides.forEach( function(valor, indice, array) {
					 var slide_ = valor;
					 if (slide_.id == slide.id){
						 slides[indice]=slide; 
					 }
					 else slides[slides.length]=slide;
				});
				 updateMapSlides(idMapaEditing, idMapa,JSON.stringify(slides)).then(function(results2){
					console.debug(results2);
				 });
				 _slidesServidor=slides;
			 });
		 }
		 else{ //no existeix l'storymap. Creem un de nou amb la info corresponent
			 var slide={
				id:$('#slide_index').val(),
				url_mapa:$('#urlMap').val(),
				titol:$('#headline').val(),
				descripcio:$('#summernote').summernote('code')
			 };
			 var slides = "["+JSON.stringify(slide)+"]";
			 _slidesServidor=slides;
			 newMapSlides(slides).then(function(results){
				 $('#idEditor').val(results.id_editor);
				 $('#idStoryMap').val(results.id);				 
			 });
		 }
	 });
	
	 $('#storymap_save').click(function(event){
		alert("URL editor:"+window.location+"id="+$('#idEditor').val() +"URL mapa:"+window.location.replace("editor","visor")+"id="+$('#idStoryMap').val()); 
		
	});
}

function clear_div_map(){
	$('#instamapsMap').src="http://www.instamaps.cat/geocatweb/visor.html";
	$('#urlMap').val('');
	$('#headline').val('');
	$('#summernote').summernote('code', '');	
	$('#slide_index').val($('.slide').length);
}

function slide_add() {
    var data = $.extend(true, {}, _default_data.storymap.slide);
    var n = _slides.length;
    if (n == 9){
    	alert("Maxxim número de slides assolit");
    }
    else{
    	 // Add slide
        _slides.push(data);
        storymap_dirty(1);
	    // Add slide element if not adding overview slide
	    if(n > 0) {
	        var slide = slide_append_element(data);
	
	        // Adjust slide container height
	        var height = $('#slides').height() + slide.outerHeight(true);
	        $('#slides').css('height', height+"px");
	
	        // Scroll new slide into view
	        $('.slides-container').scrollTop(Math.max(0, height - $('#slides').parent().height()));
	    } else {
	        slide_set_class(0);
	    }
	    // Select new slide
	    $('.slide:last').click();
    }
}

function slide_append_element(data) {
    var slide_index = $('.slide').length;

    var slide_elem = $(storymap_slide_template(data.text))
        .appendTo('#slides')
        .click(slide_select);

    $('<a class="close" href="javascript:">&nbsp;</a>')
        .appendTo(slide_elem)
        .click(slide_delete);

    slide_set_class(slide_index);
    return slide_elem;
}

function slide_select(event) {
    $(':focus').blur(); // force change event!

    //storymap_auto_save();

    $('.slide.selected').removeClass('selected');
    $(this).addClass('selected');

    _current_slide_index = $('.slide').index(this);
    if (_slidesServidor!=null){
    	var currentSlide = _slidesServidor[_current_slide_index];
    	console.debug(currentSlide);
    }

     
    //}

}


function slide_delete(event) {
    var slide_elem = $(this).closest('.slide');
    var slide_index = $('.slide').index(slide_elem);

    var data = _slides[slide_index];
    var slide_title = ((data.text) ? (data.text.headline || "(untitled)") : "(untitled)");

    show_confirm('Delete "'+slide_title+'" slide?',slide_elem, slide_index);

    return false;
}

function slide_set_class(slide_index) {
    // Get slide icon
    var elem = $('.slide-icon').eq(slide_index);

    // Remove old slide-icon-* class
    elem.removeClass(function(i, cls) {
        return cls.split(' ')
            .filter(function(val) { return _re_slide_cls.test(val); })
            .join(' ');
    });

    // Add new class
    var data = _slides[slide_index];
    /*var url = (data.media) ? (data.media.url || '') : '';
    if(url) {
        var media = VCO.MediaType({'url': url});
        if(media.type) {
            elem.addClass('slide-icon-'+media.type);
        }
    }*/
}

function storymap_dirty(is_dirty) {
    _dirty = is_dirty;

    if(is_dirty) {
        $('#storymap_save').removeClass('disabled').addClass('btn-primary');
        $('#storymap_publish').hide();
    } else {
        $('#storymap_save').addClass('disabled').removeClass('btn-primary');
        if(_storymap_meta.published_on &&
           _storymap_meta.published_on < _storymap_meta.draft_on) {
            $('#storymap_publish').show();
        }
    }
}

function show_confirm(msg,slide_elem,slide_index) {
	var modal = document.getElementById('dialog_delete_slide');
	$('#msg').html('<span>'+msg+'</span>');
	modal.style.display = "block";
	
	$('#dialog_delete_slide .btn-default').on('click', function(event){
		var modal = document.getElementById('dialog_delete_slide');
		modal.style.display = "none";
	
		var height = $('#slides').height() - slide_elem.outerHeight(true);
	
	    // Delete the slide data
	    _slides.splice(slide_index, 1);
	    storymap_dirty(1);
	
	    // Remove DOM element
	    slide_elem.remove();
	
	    // Adjust slide container height
	    $('#slides').css('height', height+"px");
	
	    if(_current_slide_index == 0) {
	        // Update overlay view
	       // _map.removeMarker(slide_index - 1);
	    } else {
	        // Reset current slide
	        if(slide_index < _current_slide_index) {
	            _current_slide_index--;
	            //storymap_auto_save();
	        } else if(slide_index == _current_slide_index) {
	            var n = Math.min(_current_slide_index, _slides.length - 1);
	            $('.slide').eq(n).click();
	        }
	    }
	});
	
	$('#dialog_delete_slide .close').on('click', function(event){
		var modal = document.getElementById('dialog_delete_slide');
		modal.style.display = "none";
	});
	
	$('#dialog_delete_slide .btn-danger').on('click', function(event){
		var modal = document.getElementById('dialog_delete_slide');
		modal.style.display = "none";
	});
   
}
