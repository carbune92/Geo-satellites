

/* 
	Create the basic app module 
	with methods for loading the Geosat dictionary from XML 
*/

var appModule = (function () {

	/* private variables and methods */
	var validKeys = ['name', 'sat_id', 'position'];


	var addToDict = function (sat) {

			g = new Geosat (sat);
			publicObj.entries.push(g);

			for (var k in g) {
				key = new Key (k, g[k]);
					if (key.key_name == 'position') {
						//key.key_info = decodeLng (g['position']);
						key.key_info = helper.decodeLng(g['position']);
					}
				publicObj.satDict.setItem (key, g);
			}
	}

	/*public variables and methods stored in an object for further modifications */
	var publicObj = {};


	var publicParseXml = function (xml) {

		publicObj.satDict = new HashTable (validKeys);
		publicObj.entries = [];

		$("satellite", xml).each (function () {
			
			var sat = {};

			sat.name 			= $(this).find("name").text();
			sat.sat_id 			= $(this).find("sat_id").text();
			sat.status 			= $(this).find("status").text();
			sat.position 		= $(this).find("position").text();
			sat.platform 		= $(this).find("platform").text();
			sat.operator 		= $(this).find("operator").text();
			sat.launch_location = $(this).find("launch_location").text();
			sat.launcher 		= $(this).find("launcher").text();
			sat.launch_date 	= $(this).find("launch_date").text();
			sat.details 		= $(this).find("details").text();
			sat.transponders 	= $(this).find("transponders").text();

			addToDict(sat);
		});
	} 

	publicObj.parseXml = publicParseXml;


	publicObj.showSatNr = function (temp) {
		var headerStr = "";
		if (!temp.length) { $("#satinfo").html("No satellites found."); return; }
				
		(temp.length > 1)? headerStr += temp.length + " satellites found: " : headerStr += "One satellite found: ";
		
		for (var i=0; i<temp.length-1; i++) { headerStr += temp[i].name
			+ ","; 
		}
		
		headerStr += temp[temp.length-1].name + ".\n";
		headerStr += "Hover mouse on icons for more information.";
		$("#satinfo").html(headerStr);
	}

	/* return the methods/members you want to be public */
	return publicObj;

})();


/* google Maps module which extends the app module */ 

var mapModule = (function (appModule) {

	var decodeLng 	 = helper.decodeLng;
	var decodeLat 	 = helper.decodeLat;
	var getGeo 	 	 = helper.getGeo;
	var latGenerator = helper.latGenerator;

	var map;

	var markers = [];

	// creates a copy of appModule; this copy will pe extended and returned as the mapModule object
	var dummyModule = jQuery.extend ({}, appModule);

	var putMarker = function (_lat, _lng, _sat) {
			
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(_lat,_lng),
			map: map,
			title: _sat.name,
			icon: "satellite2.png"
		});


		var title = new google.maps.InfoWindow ({
			content: "<font color='black'>" + _sat.name + ": " + _sat.position + "</font>"
		});
				
		var infoW = new google.maps.InfoWindow ({
			content: _sat.toHtml()
 		});

		google.maps.event.addListener (marker, 'mouseover', function() {
			infoW.open(map, marker);
		});
				
		google.maps.event.addListener (marker, 'mouseout', function() {
			infoW.close(map,marker);
		});

		markers.push (marker);

	}

	var clearMarkers = function () {
		for (var i=0; i<markers.length; i++)
			markers[i].setMap(null);	
		markers = [];
	}


	dummyModule.submitLng = function (event) {

		var satCoord = decodeLng ($("input:nth(0)").val());

		key = new Key ('position', satCoord);
		var satDict = appModule.satDict;

		if (satDict.hasItem (key)) {
			var sat  = satDict.getItem(key);
		} else {
			alert("Not a valid satellite location!");
			event.preventDefault(); return;
		}

		putMarker (0, satCoord, sat[0]);

		for (var i = 1; i < sat.length; i++) {	
			var lat = latGenerator(0.5, 5);
			putMarker (lat, satCoord, sat[i]);
		}
		map.setCenter ({lat: 0, lng: satCoord});
		
		dummyModule.showSatNr(sat);

		event.preventDefault();
	}
	
//	console.log(dummyModule);

	dummyModule.submitNameId = function (event) {
			var satName = $("#name_text").val();
			var satId   = $("#id_text").val();
			var sat; 
			var nameKey, idKey;
			var satDict = appModule.satDict;
		
			idKey 	= new Key ('sat_id', satId);
			nameKey = new Key ('name', satName);


			if (satDict.hasItem (nameKey) && 
				satName.length > 0 && 
				satId.length == 0) {
				sat = satDict.getItem (nameKey);
			}

			else if (satDict.hasItem (idKey) && 
				satId.length > 0 && 
				satName.length == 0) {
				sat = satDict.getItem (idKey);
			}

			else if (satName.length > 0 && satId.length > 0) {
				alert("Can't search after both name ands id!");
				event.preventDefault(); 
				return;				
			}
			else {
				alert("Not a valid satellite name or id!");
				event.preventDefault(); 
				return;
			}

			var satLng = decodeLng (sat[0].position);

			putMarker (0, satLng, sat[0]);

			map.setCenter ({lat: 0, lng: satLng});
				
			dummyModule.showSatNr(sat);

			event.preventDefault();
	}

	dummyModule.submitObs = function (event) {
		var obsLng = decodeLng($("#obs_lng").val());
		var obsLat = decodeLat($("#obs_lat").val()); 

				/*map.addMarker ({
					lng:  obsLng,
					lat:  obsLat,
					icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
				});*/
				
		var obsMarker = new google.maps.Marker ({
			position: new google.maps.LatLng (obsLat,obsLng),
			map: map,
			title: 'Observer',
			icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
		});
				
		map.setCenter ({lat: obsLat, lng: obsLng});

		event.preventDefault();
	}

	dummyModule.sliderCallback = function (event, data) {

		var str = "Longitude slider: ";
		var temp = [];
		(data.value <= 0)? str += Math.abs(data.value.toFixed(0)) + " V" : str += data.value.toFixed(0) + " E"; 
		$("#slider_val").html(str);

		clearMarkers();
		var satDict = appModule.satDict;
		var posKeys = satDict.keys('position');

		var geo = getGeo(data.value, posKeys, satDict);

		for (var i=0; i<geo.length; i++) {
			if (geo[i].length > 1) {
						
				var sat = geo[i][0];

				putMarker (0, decodeLng (sat.position), sat);
				temp.push(sat);

				for (var j=1; j<geo[i].length; j++) {

					sat = geo[i][j];
					var lat = latGenerator (0.5, 5);

					putMarker (lat, decodeLng (sat.position), sat);
					temp.push(sat);
				}

				map.setCenter ({lat: 0, lng: decodeLng(geo[0][0].position)});

			} else {
				sat = geo[i][0];

				putMarker (0, decodeLng (sat.position), sat);
				map.setCenter ({lat: 0, lng: decodeLng (sat.position)});
				temp.push(sat);
			}
		}
		dummyModule.showSatNr(temp);
		geo = [];
		temp = [];
	}

	dummyModule.initMap = function () {
			var mapOptions = { 
					center: new google.maps.LatLng(0.0, 0.0), 
					zoom: 3,
					mapTypeId: google.maps.MapTypeId.ROADMAP 
				};
									
			map = new google.maps.Map(document.getElementById("map"), mapOptions);

			google.maps.event.addListener(map, 'mousemove', function (event) {
				var str = "Latitude: " + event.latLng.lat().toFixed(4) + " Longitude: " + event.latLng.lng().toFixed(4);
				$("#latlong").html(str);
			});

			dummyModule.showSatNr ([]);
	};	

	return dummyModule;

})(appModule || {});

var earthModule = (function (appModule) {

	var decodeLng 	 = helper.decodeLng;
	var decodeLat 	 = helper.decodeLat;
	var getGeo 	 	 = helper.getGeo;
	var latGenerator = helper.latGenerator;

	var ge;

	var placemarks = [];

	// creates a copy of appModule; this copy will pe extended and returned as the earthModule object
	var dummyModule = jQuery.extend ({}, appModule);

	var initCallback = function (pluginInstance) {
		ge = pluginInstance;
		ge.getWindow().setVisibility(true);

		ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);
		
	}

	var failureCallback = function (errorCode) {
		if(!google.earth.isInstalled()) {
			var msg = document.getElementById('installPluginMsg');
			if(msg) {
				msg.className = 'installPluginMsg';
			} 
		}
	}

	var clearPlacemarks = function () {
		for (var i=0; i<placemarks.length; i++) {
			ge.getFeatures().removeChild(placemarks[i]);
		}
	}

	var putPlacemark = function (_lat, _lng, _sat) {

		var placemark = ge.createPlacemark('');
		placemark.setName(_sat.name);

		var icon = ge.createIcon('');
		icon.setHref('http://maps.google.com/mapfiles/kml/shapes/airports.png');
		var style = ge.createStyle('');
		style.getIconStyle().setIcon(icon);
		placemark.setStyleSelector(style);


		var point = ge.createPoint('');
		point.setLatitude(_lat);
		point.setLongitude(_lng);
		placemark.setGeometry(point);

		placemarks.push(placemark);
		ge.getFeatures().appendChild(placemark);

		var balloon = ge.createHtmlStringBalloon('');
		balloon.setFeature(placemark);
		balloon.setContentString(_sat.toHtml());

		google.earth.addEventListener(placemark, 'click', function (event) {
			event.preventDefault();
			ge.setBalloon(balloon);
		});
			
	}

	var setCamera = function (lat, lng, zoom, tilt) {


		var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);

		lookAt.setLatitude(lat);
		lookAt.setLongitude(lng);

		lookAt.setRange(25494112.73592806);
		lookAt.setTilt(0);
		lookAt.setRange(lookAt.getRange() * zoom);
		lookAt.setTilt(lookAt.getTilt() + tilt);

		ge.getView().setAbstractView(lookAt)
	}

	dummyModule.initEarth = function () {
		google.load("earth", "1");
		google.earth.createInstance('map', initCallback, failureCallback);

		appModule.showSatNr ([]);
		return;
	}

	dummyModule.submitLng = function (event) {
		var satDict   = appModule.satDict;
		var satCoord  = decodeLng ($("input:nth(0)").val());
		
		var sat;
		var key = new Key('posiion', satCoord);

		clearPlacemarks();
		if(satDict.hasItem(key)) {
			sat = satDict.getItem(key);
		} else {
			alert("Not a valid satellite location!");
			event.preventDefault(); return;
		}

		putPlacemark (0, satCoord, sat[0]);
		
		for (var i = 1; i < sat.length; i++) {
			var lat = latGenerator(0.5, 1);
			putPlacemark (lat, satCoord, sat[i]);
		}

		//center the globe and shit
		setCamera (0, satCoord, 0.01, 60);

		appModule.showSatNr(sat);

		event.preventDefault();
	}

	dummyModule.submitNameId = function (event) {
		var satDict = appModule.satDict;
		var satName = $("#name_text").val();
		var satId   = $("#id_text").val();
		var sat;
		var nameId, idKey;

		idKey 	= new Key ('sat_id', satId);
		nameKey = new Key ('name', satName);

		clearPlacemarks();
		if (satDict.hasItem (nameKey) && 
				satName.length > 0 && 
				satId.length == 0) {
			sat = satDict.getItem (nameKey);
		}
			
		else if (satDict.hasItem (idKey) && 
				satId.length > 0 && 
				satName.length == 0) {
			sat = satDict.getItem (idKey);
		}

		else if (satName.length > 0 && satId.length > 0) {
			alert("Can't search after both name ands id!");
			event.preventDefault(); 
			return;				
		}
		else {
			alert("Not a valid satellite name or id!");
			event.preventDefault(); 
			return;
		}

		var satLng = decodeLng (sat[0].position);

		putPlacemark (0, satLng, sat[0]);
		
		setCamera (0, satLng, 0.01, 60);
				
		dummyModule.showSatNr(sat);

		event.preventDefault();
	}

	dummyModule.submitObs = function (event) {
		var obsLng = decodeLng($("#obs_lng").val());
		var obsLat = decodeLat($("#obs_lat").val()); 
				
		var obsPlacemark = ge.createPlacemark('');
		obsPlacemark.setName("Observer");

		var icon = ge.createIcon('');
		icon.setHref("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
		var style = ge.createStyle('');
		style.getIconStyle().setIcon(icon);
		obsPlacemark.setStyleSelector(style);


		var point = ge.createPoint('');
		point.setLatitude(obsLat);
		point.setLongitude(obsLng);
		obsPlacemark.setGeometry(point);

		ge.getFeatures().appendChild(obsPlacemark);
				
		setCamera (obsLat, obsLng, 0.01, 60);

		event.preventDefault();
	}

	dummyModule.sliderCallback = function (event, data) {

		var str = "Longitude slider: ";
		var temp = [];
		(data.value <= 0)? str += Math.abs(data.value.toFixed(0)) + " V" : str += data.value.toFixed(0) + " E"; 
		$("#slider_val").html(str);

		clearPlacemarks();
		var satDict = appModule.satDict;
		var posKeys = satDict.keys('position');

		var geo = getGeo(data.value, posKeys, satDict);

		for (var i=0; i<geo.length; i++) {
			if (geo[i].length > 1) {
						
				var sat = geo[i][0];

				putPlacemark (0, decodeLng (sat.position), sat);
				temp.push(sat);

				for (var j=1; j<geo[i].length; j++) {

					sat = geo[i][j];
					var lat = latGenerator (0.5, 5);

					putPlacemark (lat, decodeLng (sat.position), sat);
					temp.push(sat);
				}


				setCamera (0, decodeLng(geo[0][0].position), 0.01, 60);

			} else {
				sat = geo[i][0];

				putPlacemark (0, decodeLng (sat.position), sat);
				// map.setCenter ({lat: 0, lng: decodeLng (sat.position)});
				setCamera (0, decodeLng(sat.position), 0.01, 60);
				temp.push(sat);
			}
		}
		dummyModule.showSatNr(temp);
		geo = [];
		temp = [];
	}


	return dummyModule;

}) (appModule || {});
