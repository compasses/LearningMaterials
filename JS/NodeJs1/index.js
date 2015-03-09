var server = require("./server"),
	router = require("./router"),
	requestHandler = require("./requestHandler");


var handle = {};
handle["/"] = requestHandler.start;
handle["/start"] = requestHandler.start;
handle["/upload"] = requestHandler.upload;

server.start(router.route, handle);