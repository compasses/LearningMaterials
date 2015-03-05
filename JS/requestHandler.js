var exec = require("child_process").exec;
var querystring = require("querystring");

function start(response, postData) {
	console.log("request handler 'start' was called.");

	//var content = "empty";
  	var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
	// exec("ls -al", function (error, stdout, stderr) {
	// 	response.writeHead(200, {"Content-Type":"text/plain"});
	// 	response.write(stdout);
	// 	response.end();
	// 	content = stdout+error+stderr;
	// });
	// return content;
}
function upload(response, postData) {
	console.log("request handler 'upload' was called.");

	response.writeHead(200, {"Content-Type":"text/plain"})
	response.write("hello upload: " + querystring.parse(postData).text);
	response.end();
	//return "hello Upload";
}

exports.start = start;
exports.upload = upload;