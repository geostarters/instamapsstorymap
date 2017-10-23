jQuery(document).ready(function() 
{

	var storymap = new StoryMap({language: "ca"});

	var id = url('?id') || null;
	if (id != null) {//Comprovem id mapa editor per carregar slides

		storymap.load(id);

	}
	
});
