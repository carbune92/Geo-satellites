			/* various classes definitions used in modules */


			/* geostationary satellite class which encapsulates the xml information */
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
            }

				Geosat.prototype.toHtml = function () {
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




/* satellite dictionary used for searches */
function HashTable (validKeys) {
    this.length = 0;
    this.items = {};
    this.keyNames = {};
    this.validKeyNames = validKeys;


    this.setItem = function(key, value) {

        if (this.validKeyNames.indexOf(key.key_name) <= -1) {
            return;
        }

        if (this.hasItem(key)) {
            this.items[key.key_info].push(value);
        }

        else {
            this.length++;
            this.items[key.key_info]    = [];
            this.items[key.key_info].push(value);

            this.keyNames[key.key_info] = key.key_name;
        }
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key.key_info] : undefined;
    }

    this.getKeyType = function(key) {
        return this.hasItem(key) ? this.keyNames[key.key_info] : undefined;
    }

    this.hasItem = function(key) {
        //return this.items.hasOwnProperty(key.key_info);
        return this.items[key.key_info] != undefined;
    }
   
    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key.key_info];
            this.length--;
            delete this.items[key.key_info];
            return previous;soundtrack
        }
        else {
            return undefined;
        }
    }

    // return all keys coresponding to filter or all keys if filter is undefined
    this.keys = function (filter) {
        
        var keys = [];
        if (filter == undefined) {
            for (var k in this.items) {
                if (this.items[k] != undefined) {
                    keys.push(k);
                }
            }
        } else {
            for (var k in this.items) {
                if (this.items[k] != undefined && this.keyNames[k] == filter) {
                    keys.push(k);
                }
            }
        }

        return keys;
    }

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function()
    {
        this.items = {}
        this.length = 0;
    }
}

	/* constructor for Key object used in dictionary */
	function Key (name, value) {
		this.key_name = name;
		this.key_info = value;
	}


    /* other helper functions */
    var helper = {
        
        latGenerator : function (a, b) { 
                            return (((Math.random() * (b - a) + a).toFixed(4)) * Math.pow(-1,Math.floor(Math.random()*10+1)));
        },

        extend : function (object, prop) {
                    for (var key in prop) {
                        object[key] = prop[key];
                    }
        },

        decodeLng : function (lng) {
                        var splited = lng.split(" ");
                        if (splited[1] == undefined) {
                            return parseFloat(splited[0]);
                        }
                        return (splited[1].toLowerCase() === 'E'.toLowerCase())? parseFloat(splited[0]) : -parseFloat(splited[0]);
        },

        decodeLat : function (lat) {
            var splited = lat.split(" ");
            if (splited[1] == undefined) {
                return parseFloat(splited[0]);
            }
            return (splited[1].toLowerCase() === 'N'.toLowerCase())? parseFloat(splited[0]) : -parseFloat(splited[0]);
        },

        getGeo : function (lng, posKeys, satDict) {
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
                        if (posKeys[i] >= (lng - 0.51) && posKeys[i] <= (lng +  0.50)) {
                            k = new Key ('position', posKeys[i]);
                            geo.push (satDict.getItem(k));
                        }
                }

                return geo;
            }

    };

