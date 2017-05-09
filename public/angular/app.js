const app = angular.module('pctMap',['ngRoute','ngMaps'] );

//Routing
app.config( $routeProvider =>{
	$routeProvider
		.when('/',{
			templateUrl: 'angular/map/map.html'
		});
});
