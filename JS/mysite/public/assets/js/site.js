(function(window, $){
	$( document ).ready(function() {
    	console.log( "ready!" );
    	$('p').text('I am ok');
    	var $$ = Sprint;
    	$$('p').text('Change for sprint');
	});
}(window, jQuery));