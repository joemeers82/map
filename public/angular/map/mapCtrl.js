'use strict';

angular.module('pctMap')
.controller('mapCtrl', ($scope, $http)=>{

//Http request to get coordinate data 
$http.get('api/pct-data.json').then(function(res){
	
	$scope.details = res.data;
	
	//Initialize array to push coordinates JSON file
	$scope.coordinates=[];
	
	//Adds coordinates(minus mile marker) to Coordinate array
	angular.forEach($scope.details, function(value, key){
    	$scope.coordinates.unshift(value.splice(1));
   	});
	
	//Reversing Mile Markers
	$scope.markerArray=[];
	for(let j =$scope.coordinates.length-1;j>=0;j--){
		$scope.markerArray.push($scope.details[j][0]);
	}
	
	//Initialize empty array for user input
	$scope.userCoordinates=[];

	//Loads Map on page load with coordinates lined out
	$scope.polylines = {
		//Add coordinates from coordinates array
		coords: [
			 	$scope.coordinates
		],
		center: [32.58971,-116.46696],
		options: function(l, map) {
		    return {
		    	strokeColor: "#e74c3c"
		    };
		}
	};

	//Add User Input
	$scope.addUserCoords =()=>{
		let userCoords =[$scope.lat,$scope.long];
		if($scope.lat !='' && $scope.long !=''){
			$scope.userCoordinates.unshift(userCoords);
			$scope.coordinates.unshift(userCoords);
			$scope.lat='';
			$scope.long='';
			$scope.loadMap();
		}
		$('.recent-searches-container').scrollTop(0);
		
	}

	//Haversine Formula
	let distance = (lat1, lon1, lat2, lon2, unit)=>{
        let radlat1 = Math.PI * lat1/180
        let radlat2 = Math.PI * lat2/180
        let radlon1 = Math.PI * lon1/180
        let radlon2 = Math.PI * lon2/180
        let theta = lon1-lon2
        let radtheta = Math.PI * theta/180
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
	}
	
	//Find Nearest Marker
	$scope.userFindCoords =()=>{
		$scope.findCoordinates = [];
		let findCoords = [$scope.closestLat,$scope.closestLong];
		$scope.findCoordinates.unshift(findCoords);
		
		if($scope.closestLong !='' && $scope.closestLat !=''){
			
			//Initialize Array to include Distance from searched coordinates along with Preprogrammed coords
			$scope.coordsWithDistanceArray=[];

			//Initialize Array to include Distances only 
			$scope.distanceArray=[];

			//Initialize Array with Miles and Markers
			$scope.coordsWithDistanceAndMilesArray=[];

			
			for(let i=0;i<$scope.coordinates.length;i++){
				
				let findDistance = distance($scope.closestLat,$scope.closestLong,$scope.coordinates[i][0],$scope.coordinates[i][1], 'K');		
				$scope.newDist = Math.round(findDistance*1000)/1000;

				//Array with Mile Markers
				let coordsWithDistanceAndMiles=[$scope.markerArray[i],$scope.coordinates[i][0],$scope.coordinates[i][1],$scope.newDist];
				
				let coordsWithDistance=[$scope.coordinates[i][0],$scope.coordinates[i][1],$scope.newDist];
				
				$scope.coordsWithDistanceArray.unshift(coordsWithDistance);
				
				$scope.distanceArray.push($scope.newDist);

				$scope.coordsWithDistanceAndMilesArray.unshift(coordsWithDistanceAndMiles);

			}

			//Find the smallest number(distance) in the array of distances
			let minDist = Math.min.apply(null,$scope.distanceArray);
			
			//Loop through array of Coords with Distances
			for(let i=0;i<$scope.coordsWithDistanceArray.length;i++){
				
				//Search each array to check if it includes minimum distance
				if($scope.coordsWithDistanceArray[i].indexOf(minDist) === 2){
					
					//Push those coordinates into Array to be used for Map 
					$scope.findCoordinates.push($scope.coordsWithDistanceArray[i]);
					
					//Add coordinates to display markers
					$scope.points = {
				 		coords: 
				 			$scope.findCoordinates,
					}

					//Keep existing polyline coordinates active, add new line to visualize distance between markers
					$scope.polylines = {
						coords: [
							 	$scope.coordinates,$scope.findCoordinates
						],
						center: [32.58971,-116.46696],
						options: function(l, map) {
					    	return {
					    		strokeColor: "#e74c3c"
					    	};
						}
					};
					//Grab the Latitude coordinate from the matching mile marker
					let firstLat = $scope.findCoordinates[1][0];
					

					//Loop through array with mile markers to print out 
					for(let i=0;i<$scope.coordsWithDistanceAndMilesArray.length;i++){
						if($scope.coordsWithDistanceAndMilesArray[i].indexOf(firstLat) != -1){
							$scope.mileMarker = $scope.coordsWithDistanceAndMilesArray[i][0];
							$scope.matchLat   = $scope.coordsWithDistanceAndMilesArray[i][1];
							$scope.matchLong  = $scope.coordsWithDistanceAndMilesArray[i][2];
						}
					}
				}	
			}
			//Clears input fields
	    	$scope.closestLat='';
			$scope.closestLong='';
		}
		
	}
	
	//Update User Coordinates for finding closest coordinates on map
	$scope.updateCoord = coord =>{
		$scope.closestLat = $scope.closestLat;
		$scope.cloestLong = $scope.Long;

		$scope.loadMap();
	}

	//Delete User Input for finding closest coordinates on map
	$scope.removeCoord = coord=>{
		let index = $scope.coordinates.indexOf(coord);
	    $scope.coordinates.splice(index,1);
	    $scope.userCoordinates.splice(index,1);
		$scope.loadMap();
	}

	$scope.clearCoordinates = ()=>{
		let userArrayLength= $scope.userCoordinates.length;
		$scope.coordinates.splice(0,userArrayLength);
		$scope.userCoordinates=[];
		$scope.loadMap();
	}

	//Reloads map when changes occur
	$scope.loadMap = ()=>{	
		//Add coordinates from user input array to display markers
		$scope.points = {
		 	coords: 
		 		//serializes array of user coordinates into JSON
    			JSON.parse(angular.toJson($scope.userCoordinates)),
    	}
		$scope.polylines = {
			//Add coordinates from coordinates array
		    coords: [
			    		$scope.coordinates
			],
			options: function(l, map) {
			    return {
			    	strokeColor: "#e74c3c"
			    };
		   }
		};
	};
	
});

});