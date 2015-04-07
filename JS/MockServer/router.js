function route(handle, pathname, response, postData) {
	var q = pathname.split('@');
	var controller = q.pop();
	
	if (typeof handle[controller] === 'function') {
		return handle[controller].apply(null, [response, postData]);
	} else if (controller.match(/SalesOrder\((\d+)\)/g) !== null){
		return handle['getSalesOrder'].apply(null, [response, postData]);
	} else if (controller.match(/login/g) !== null) {
		
		return handle['logIn'].apply(null, [response, postData]);
	} else {
		console.log("--------------No request handler for : " + controller);
		response.writeHead(200, {"Content-Type": "application/json"});
		response.write("NULL");
		response.end();
	}
}
exports.route = route;
