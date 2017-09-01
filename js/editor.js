jQuery(document).ready(function() 
{

	var storymap = new StoryMap({language: "ca"});

	eventsButtons(storymap);

	var id = url('?id') || null;
	if (id != null) {//Comprovem id mapa editor per carregar slides

		storymap.load(id);

	}
	
});

function eventsButtons(storymap){
	
	 $('#storymap_save').click(function(event){

	 	storymap.save().then((results) => {

	 		storymap.publish();

	 	}, 
	 	() => {

	 		showErrorPublicant();

	 	});
		
	});

}
