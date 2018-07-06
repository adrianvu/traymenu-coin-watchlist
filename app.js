const request = require('request');

request('https://api.coinmarketcap.com/v2/ticker/?limit=10', function (error, response, body) {
    body = JSON.parse(body);

    console.log("body:"+body.data);
	for (var key in body.data) {
	    if (body.data.hasOwnProperty(key)) {
	        console.log(key + " -> " + body.data[key].symbol);
	        console.log(key + " -> " + body.data[key].quotes.USD.price);
	    }
	}

});