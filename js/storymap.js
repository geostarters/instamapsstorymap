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

var _re_slide_cls = /^slide-icon-\w+$/;
var storymap_slide_template = _.template($("#storymap_slide_template").html().trim());
jQuery(document).ready(function() {
	$('#slide1').html('<span>Slide 1</span>');
	eventsButtons();
	// Create StorySlider
	_slides = $('#slides');
	//test node service
	testNode();
});



function eventsButtons(){
	$('#dialog_load_map .btn-default').on('click', function(event){
		var modal = document.getElementById('dialog_load_map');
		var loc=document.getElementById('urlInstamaps').value;
		document.getElementById('instamapsMap').src = loc;
		modal.style.display = "none";
	});
	
		
	$('#dialog_load_map .close').on('click', function(event){
		var modal = document.getElementById('dialog_load_map');
		modal.style.display = "none";
	});
	
	$('#dialog_load_map .btn-danger').on('click', function(event){
		var modal = document.getElementById('dialog_load_map');
		modal.style.display = "none";
	});
	$('#storymap_load').on('click', function(event){
		var modal = document.getElementById('dialog_load_map');
		modal.style.display = "block";
	});
	$('#storymap_unload').on('click', function(event){
		var modal = document.getElementById('dialog_load_map');
		document.getElementById('instamapsMap').src = 'https://www.instamaps.cat/geocatweb/visor.html';
		modal.style.display = "none";
	});
	
	$('#obrir_menu').on('click', function(event){
			var style = $('#mapaFrame').attr("style");
			if (style.indexOf("75%")>-1) $('#mapaFrame').attr('style','height:100%;width:100%;float:left');
			else $('#mapaFrame').attr('style','height:100%;width:75%;float:left');
	});
	
	 $('#storymap_add_slide').click(function(event) {
	         slide_add();
	         
	 });
	
}

function slide_add() {
    var data = $.extend(true, {}, _default_data.storymap.slide);
    var n = _slides.length;
   

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

   /* if(preview_visible()) {
        if(_storymap_object) {
            _storymap_object.goTo(_current_slide_index);
        }
    } else {*/
       
        //_map.zoomEnable(false);
       // _map.clearOverlays();

        if(_current_slide_index == 0) {
            // Show overview view
           

            for(var i = 1; i < _slides.length; i++) {
                if(_slides[i].hasOwnProperty('location')) {
                    var loc_data = _slides[i].location;

                }
            }

            $('#marker_options').attr('disabled',true);

            
        } else {
            // Show slide view
           
        }

     
    //}

}


function slide_delete(event) {
    var slide_elem = $(this).closest('.slide');
    var slide_index = $('.slide').index(slide_elem);

    var data = _slides[slide_index];
    var slide_title = ((data.text) ? (data.text.headline || "(untitled)") : "(untitled)");

    show_confirm('Delete "'+slide_title+'" slide?', function() {
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
            _map.removeMarker(slide_index - 1);
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

        // Refresh preview
       // preview_refresh();
    });

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

function show_confirm(msg, callback) {
    $('#confirm_modal .modal-msg').html(msg);
    $('#confirm_modal .btn-primary').one('click.confirm', function(event) {
        $('#confirm_modal').modal('hide');
        if(callback) {
            callback();
        }
    });
    $('#confirm_modal').modal('show');
}
