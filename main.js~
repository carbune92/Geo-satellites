		function main (xml) {

			var map;
			var satDict;
			var user_marker;
			var validKeys = ['name', 'sat_id', 'position'];
			var posKeys;

			function Geosat (propArr) {

				this.name   		 = propArr['name'];
				this.sat_id 		 = propArr['sat_id'];
				this.status 		 = propArr['status'];
				this.position 		 = propArr['position'];
				this.platform	 	 = propArr['platform'];
				this.operator 		 = propArr['operator'];
				this.launch_location = propArr['launch_location'];
				this.launcher 		 = propArr['launcher'];
				this.launch_date 	 = propArr['launch_date'];
				this.details 		 = propArr['details'];
				this.transponders 	 = propArr['transponders'];

				this.toHtml = function () {
					return "<div class='infobox-wrapper'>\
							<div id='infobox'>\
								<table>\
									<tr>\
										<td colspan='2' align=center><font size='3'>"+this.name+"<\/td>\
									<\/tr>\
									<tr>\
										<td><font size='3'><b> ID: <\/b><\/td>\
										<td>" + this.sat_id + "<\/td>\
									<\/tr>\
									<tr>\
										<td><font size='3'><b> Status: <\/b><\/td>\
										<td>" + this.status + "<\/td>\
									<\/tr>\
									<tr>\
										<td><font size='3'><b> Position: <\/b><\/td>\
										<td>" + this.position + "<\/td>\
									<\/tr>\
									<tr>\
										<td><font size='3'><b> Platform: <\/b><\/td>\
										<td>" + this.platform + "<\/td>\
									<\/tr>\
									<tr>\
										<td><font size='3'><b> Operator: <\/b><\/td>\
										<td>" + this.operator + "<\/td>\
									<\/tr>\
									<tr>\
										<td><font size='3'><b> Launch location: <\/b><\/td>\
										<td>" + this.launch_location + "<\/td>\
									<\/tr>\
									<tr>\
										<td><font size='3'><b> Launcher: <\/b><\/td>\
										<td>" + this.launcher + "<\/td>\
									<\/tr>\
									<tr>\
										<td><font size='3'><b> Launch date: <\/b><\/td>\
										<td>" + this.launch_date + "<\/td>\
									<\/tr>\
									<tr>\
										<td><font size='3'><b> Details: <\/b><\/td>\
										<td>" + this.details + "<\/td>\
									<tr>\
										<td><font size='3'><b> Transponders: <\/b><\/td>\
										<td>" + this.transponders + "<\/td>\
									<\/tr>\
								<\/table>\
							<\/div>\
							<\/div>"
				}
			}

			function Key (name, value) {
				this.key_name = name;
				this.key_info = value;
			}

			Geosat.entries = new Array();
			Geosat.markers = new Array();

			function initMap (jquery) {

			/*	map = new GMaps ({
  					 	div: 	'#map',
					 	lat: 	 8.754794702435618,
					 	lng: 	 23.203125,
					 	zoom: 	 3,
					 	click:   function (e) { alert(e.latLng.lat() +  " " + e.latLng.lng()); }
					}); */
					
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
			}

			function geolocate () {
				GMaps.geolocate ({
					success: 		function (position) {
										var userCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
										
										map.setCenter (userCoords.lat, userCoords.lng);	

										user_marker = map.createMarker ({
														lat: userCoords.lat,
														lng: userCoords.lng,
														details: {
															title: 'You are here.',
														},
														icon:  'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
													});

									/*	map.addMarker ({
											lat: 		userCoords.lat, 
											lng:  		userCoords.lng,
											title:      'You are here', 
											icon: 		'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',	
										});*/

										map.addMarker (user_marker);

									},

					error:  		function (error) { 
										alert("Error!"); 
									},

					not_supported: 	function () { 
										alert("Your browser does not support geolocation.");
									}
				});
			}

			function latGenerator (a, b) { 
					//return (((Math.random() * (0.120 - 0.0200) + 0.0200).toFixed(4)) * Math.pow(-1,Math.floor(Math.Random()*10+1)));
					return (((Math.random() * (b - a) + a).toFixed(4)) * Math.pow(-1,Math.floor(Math.random()*10+1)));
			}

			function putMarker (_lat, _lng, _sat) {
			
				/*var marker = map.createMarker ({
					lat: _lat,
					lng: _lng,
					details: {
						title: _sat.name,
					},
				});*/
				
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(_lat,_lng),
					map: map,
					title: _sat.name,
					icon: "satellite2.png"
				});

				
			/*	var marker = new MarkerWithLabel ({
					position: new google.maps.LatLng(_lat,_lng),
					draggable: false,
					map: map,
					labelContent: _sat.name,
					//labelAnchor: new google.maps.Point(30, 0),
					labelClass: "labels", // the CSS class for the label
					labelStyle: {opacity: 1.00}
				}); */

				var title = new google.maps.InfoWindow ({
					content: "<font color='black'>" + _sat.name + ": " + _sat.position + "</font>"
				});
				
				var infoW = new google.maps.InfoWindow ({
					content: _sat.toHtml()
 				});

				//title.open(map, marker);

			/*	var info = _sat.toHtml();
				var infoW = new google.maps.InfoWindow ({
					content : info
				});

				var infoW = new InfoBox ({
         			content: info,
         			disableAutoPan: false,
         			maxWidth: 150,
         			pixelOffset: new google.maps.Size(-140, 0),
         			zIndex: null,
         			boxStyle: {
            			background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
           				opacity: 0.75,
           	 			width: "280px"
        			},
        			closeBoxMargin: "12px 4px 2px 2px",
        			closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
        			infoBoxClearance: new google.maps.Size(1, 1)
    			}); */

				google.maps.event.addListener (marker, 'mouseover', function() {
					infoW.open(map, marker);
				});
				
				google.maps.event.addListener (marker, 'mouseout', function() {
					infoW.close(map,marker);
				});

				Geosat.markers.push (marker);
				//map.addMarker(marker);
			}

			function submitLng (event) {

				clearMarkers();

				var satCoord = decodeLng ($("input:nth(0)").val());

				key = new Key ('position', satCoord);

				if (satDict.hasItem (key)) 
					var sat  = satDict.getItem(key); 

				else {
					alert("Not a valid satellite location!");
					event.preventDefault(); return;
				}

				putMarker (0, satCoord, sat[0]);

				for (var i = 1; i < sat.length; i++) {
				
					var lat = latGenerator(0.5, 5);
					putMarker (lat, satCoord, sat[i]);
				}

				

				map.setCenter ({lat: 0, lng: satCoord});
				showSatNr(sat);
				
				event.preventDefault();
			}

			function submitNameId (event) {
				var satName = $("#name_text").val();
				var satId   = $("#id_text").val();
				var sat; 
				var nameKey, idKey;
				
				clearMarkers();

				idKey = new Key ('sat_id', satId);
				nameKey = new Key ('name', satName);

				if (satDict.hasItem (nameKey)) {
					sat = satDict.getItem (nameKey);
				}

				else if (satDict.hasItem (idKey)) {
					sat = satDict.getItem (idKey);
				}

				else {
					alert("Not a valid satellite name or id!");
					event.preventDefault(); 
					return;
				}

				var satLng = decodeLng (sat[0].position);

				putMarker (0, satLng, sat[0]);

				map.setCenter ({lat: 0, lng: satLng});
				
				showSatNr([sat]);

				event.preventDefault();
			}

			function submitObs (event) {
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

			function decodeLng (lng) {
				var splited = lng.split(" ");
				if (splited[1] == undefined) {
					return parseFloat(splited[0]);
				}
				return (splited[1].toLowerCase() === 'E'.toLowerCase())? parseFloat(splited[0]) : -parseFloat(splited[0]);
			}

			function decodeLat (lat) {
				var splited = lat.split(" ");
				if (splited[1] == undefined) {
					return parseFloat(splited[0]);
				}
				return (splited[1].toLowerCase() === 'N'.toLowerCase())? parseFloat(splited[0]) : -parseFloat(splited[0]);
			}
			
			function showSatNr (temp) {
				var headerStr = "";
				if (!temp.length) { $("#satinfo").html("No satellites found."); return; }
				
				(temp.length > 1)? headerStr += temp.length + " satellites found: " : headerStr += "One satellite found: ";
				for (var i=0; i<temp.length-1; i++) {
					headerStr += temp[i].name + ","; 
				}
				headerStr += temp[temp.length-1].name + ".\n";
				headerStr += "Hover mouse on icons for more information.";
				$("#satinfo").html(headerStr);
			}

			function clearMarkers () {
				for (var i=0; i<Geosat.markers.length; i++)
					Geosat.markers[i].setMap(null);	
				Geosat.markers = [];
			}

			function getGeo (lng) {
				var geo = [];

				if (lng == -180) {
					for (var i in posKeys)
						if (posKeys[i] >= -180 && posKeys[i] <= -179.50) {
							k = new Key ('position', posKeys[i]);
							geo.push (satDict.getItem(k));
						}
				} else if (lng == 180) {
					for (var i in posKeys)
						if (posKeys[i] >= 179.51 && posKeys[i] <= 180) {
							k = new Key ('position', posKeys[i]);
							geo.push (satDict.getItem(k));
						}
				} else if (lng >= 0 && lng != 180) {
					for (var i in posKeys)
						if (posKeys[i] >= (lng - 0.49) && posKeys[i] <= (lng + 0.50)) {
							k = new Key ('position', posKeys[i]);
							geo.push (satDict.getItem(k));
						}
				} else if (lng < 0 && lng != -180) {
					for (var i in posKeys)
						if (posKeys[i] >= (lng - 0.51) && posKeys[i] <= (lng + 	0.50)) {
							k = new Key ('position', posKeys[i]);
							geo.push (satDict.getItem(k));
						}
				}

				return geo;
			}

			function parseXml (xml) {

				satDict = new HashTable (validKeys);
				
				$("satellite", xml).each (function () {
					var sat = {};
					

					sat.name 			= $(this).find("name").text();

					sat.sat_id 			= $(this).find("sat_id").text();
					//alert(sat.sat_id);
					sat.status 			= $(this).find("status").text();

					sat.position 		= $(this).find("position").text();

					sat.platform 		= $(this).find("platform").text();
					sat.operator 		= $(this).find("operator").text();
					sat.launch_location = $(this).find("launch_location").text();
					sat.launcher 		= $(this).find("launcher").text();
					sat.launch_date 	= $(this).find("launch_date").text();
					sat.details 		= $(this).find("details").text();
					sat.transponders 	= $(this).find("transponders").text();

					g = new Geosat (sat);
					Geosat.entries.push(g);

					for (var k in g) {
						key = new Key (k, g[k]);
						if (key.key_name == 'position') {
							key.key_info = decodeLng (g['position']);
						}
						satDict.setItem (key, g);
					}

					posKeys = satDict.keys('position');
				});
			}
			
			/* jQuery events */


			parseXml (xml);

			$("#map").ready (initMap);
			
			$("#lng").submit (submitLng);
			
			$("#name_id").submit (submitNameId);

			$("#obs").submit (submitObs);
			
			$("#user_check").change ( function () {
				if ($(this).is(':checked')){
					geolocate();
				} else {
					//map.removeMarker (user_marker);
					user_marker.setMap(null);
				}
			});
	    
      $("#to_earth").change ( function () {
				if ($(this).is(':checked')){
					initEarth (satDict);
				} else {
          initMap();
				}
			});

			$("#slider").bind("slider:changed", function (event, data) {
				var str = "Longitude slider: ";
				var temp = [];
				(data.value <= 0)? str += Math.abs(data.value.toFixed(0)) + " V" : str += data.value.toFixed(0) + " E"; 
				$("#slider_val").html(str);
				
		/*		for (var i=0; i<Geosat.markers.length; i++) {
					//map.removeMarker (Geosat.markers[i]);
					Geosat.markers[i].setMap(null);
				} */

				clearMarkers();
	//			Geosat.markers = [];

				var geo = getGeo (data.value);

				//for (var i in geo) {
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
				showSatNr(temp);
				geo = [];
				temp = [];
			});

		}
