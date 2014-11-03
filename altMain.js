


function altMain (xml) {

	var eventCallback = {
		submitLng : mapModule.submitLng
	};

	appModule.parseXml(xml);

	/* main functionality event binding */
	$('#map').ready(mapModule.initMap);

	$('#lng').submit(mapModule.submitLng);
	$('#name_id').submit(mapModule.submitNameId);
	$('#obs').submit(mapModule.submitObs);
	$('#slider').bind("slider:changed", mapModule.sliderCallback);

	/* options event binding */
	
	/* switch between Gearth and Gmaps and change event callbacks acordingly */

	$("#to_earth").change ( function () {

		if ($('#to_earth').is(':checked')) {
			earthModule.initEarth();
			$('#lng').unbind('submit').submit(earthModule.submitLng);
			$('#name_id').unbind('submit').submit(earthModule.submitNameId);
			$('#obs').unbind('submit').submit(earthModule.submitObs);
			$('#slider').unbind('submit').bind('slider:changed',earthModule.sliderCallback);

		} else {
			document.location = document.location; 
		}
		
	});
}