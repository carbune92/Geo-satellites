// Create the placemark.
var placemark = ge.createPlacemark('');
placemark.setName("placemark");

// Define a custom icon.
var icon = ge.createIcon('');
icon.setHref('http://maps.google.com/mapfiles/kml/paddle/red-circle.png');
var style = ge.createStyle(''); //create a new style
style.getIconStyle().setIcon(icon); //apply the icon to the style
placemark.setStyleSelector(style); //apply the style to the placemark

// Set the placemark's location.  
var point = ge.createPoint('');
point.setLatitude(12.345);
point.setLongitude(54.321);
placemark.setGeometry(point);

// Add the placemark to Earth.
ge.getFeatures().appendChild(placemark);
