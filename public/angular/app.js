const app = angular.module('pctMap',['ngRoute','ngMaps','vs-repeat'] );

//Routing
app.config( $routeProvider =>{
	$routeProvider
		.when('/',{
			templateUrl: 'angular/map/map.html'
		});
});
