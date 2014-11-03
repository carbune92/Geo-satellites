function HashTable (validKeys)
{
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
            return previous;
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
