var http = require("http");
var url  = require("url");

function start(route, handle) {
	function onRequest(request, response) {
		var postData = "";
		var pathname =  url.parse(request.url).pathname;
		if (global.Debug) {
			console.log("get URL: " + request.url);
			console.log(request.headers);
		}		
		//console.log("request for" + pathname + " received");
		request.setEncoding("utf8");
		request.addListener("data", function(postDataChunk) {
			postData += postDataChunk;
			if (global.Debug) {
				console.log("Received data chunk '" + postDataChunk + "'");
			}

		});

		request.addListener("end", function() {
			route(handle, pathname, response, postData);			
		});
	}

	var port = 8080;
	http.createServer(onRequest).listen(port);

	console.log('server has started at : ' + port);
}
exports.start = start;


