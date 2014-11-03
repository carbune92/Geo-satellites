
//function earth() {
	var ge;
	google.load("earth", "1");

	function initEarth (satDict, posKeys) {
		google.earth.createInstance('map', initCallback, failureCallback);
		return;
	}

	function initCallback (pluginInstance) {
		ge = pluginInstance;
		ge.getWindow().setVisibility(true);
	
		ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);
	}

	function failureCallback(errorCode) {
		if (!google.earth.isInstalled()) {
		var msg = document.getElementById('installPluginMsg');
		  if (msg) {
		    msg.className = 'installMsgContainer';
		  }
		}
	}

/*	initEarth();
	return;
} */
