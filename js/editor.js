jQuery(document).ready(function() 
{

	var storymap = new StoryMap();

	eventsButtons();

	var id = url('#id') || null;
	if (id != null) {//Comprovem id mapa editor per carregar slides

		storymap.load(id);

	}
	
});

function eventsButtons(){
	
	 $('#storymap_save').click(function(event){
		alert("URL editor:"+window.location+"id="+$('#idEditor').val() +"URL mapa:"+window.location.replace("editor","visor")+"id="+$('#idStoryMap').val()); 
		
	});

}
