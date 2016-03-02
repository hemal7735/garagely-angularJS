var app = angular.module("garagely",['ui.bootstrap','ui.router']);

app.controller('ModalController', ['$scope','$uibModal','$log',function ($scope, $uibModal, $log) {

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: './ModalForm.html',
      controller: 'ModalInstanceCtrl',
      size: size
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
   
}]);

app.controller('ModalInstanceCtrl', ['$scope','$uibModalInstance',function ($scope, $uibModalInstance) {

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  };
}]);

app.controller('MapController', ['$scope', function ($scope) {

    $scope.latlng = {lat: -1 ,lng: -1};
    $scope.accuracy = "0";
    $scope.error = "";

    $scope.getCurrLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
        }
        else {
            $scope.error = "Geolocation is not supported by this browser.";
        }
    }

    $scope.showPosition = function (position) {
        $scope.latlng.lat = position.coords.latitude;
        $scope.latlng.lng = position.coords.longitude;
        $scope.accuracy = position.coords.accuracy;
        $scope.$apply();

        //change current Center
        var latlng = new google.maps.LatLng($scope.latlng.lat, $scope.latlng.lng);
        $scope.map.setCenter(latlng);
        $scope.marker.position = latlng;
    }

    $scope.showError = function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
            $scope.error = "User denied the request for Geolocation."
            break;
            case error.POSITION_UNAVAILABLE:
            $scope.error = "Location information is unavailable."
            break;
            case error.TIMEOUT:
            $scope.error = "The request to get user location timed out."
            break;
            case error.UNKNOWN_ERROR:
            $scope.error = "An unknown error occurred."
            break;
        }
        $scope.$apply();
    }

    // get Current Location using Sensor
    $scope.getCurrLocation();

    var mapOptions = {
      zoom: 15,
      center: new google.maps.LatLng($scope.latlng.lat, $scope.latlng.lng),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.marker = new google.maps.Marker({
        position: {lat: $scope.latlng.lat , lng: $scope.latlng.lng},
        map: $scope.map,
        draggable: true
    });

    $scope.showResult = function () {
        return $scope.error == "";
    }

    // To help Marker for dragging
    google.maps.event.addListener($scope.marker, 'dragend', function (evt) {
            // document.getElementById('current').innerHTML = '<p>Lat: ' + evt.latLng.lat().toFixed(3) + 'Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
            document.getElementById('lat').innerHTML = evt.latLng.lat();
            document.getElementById('lng').innerHTML = evt.latLng.lng();
            
            $scope.latlng.lat = evt.latLng.lat();
            $scope.latlng.lng = evt.latLng.lng();

            console.log($scope.latlng.lat+"\n"+$scope.latlng.lng);

            $scope.map.setCenter($scope.marker.position);
            $scope.marker.setMap($scope.map);
        });
    // To fix google map sizing issue
   google.maps.event.addListenerOnce($scope.map, 'idle', function(){
       google.maps.event.trigger($scope.map, 'resize');
       $scope.map.setCenter($scope.marker.position);
        $scope.marker.setMap($scope.map);
   });

}]);

app.controller('FormController', ['$scope', function($scope){
  
}]);

app.controller('MainController', ['', function(){
  
}]);

app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: './home.html',
      controller: 'MainController'
          })

    .state('about',{
      url: '/about',
      templateUrl: './about.html',
      controller: 'MainController'
    })
    
    .state('blog',{
      url: '/blog',
      templateUrl: './blog.html',
      controller: 'MainController'
    });
    
    $urlRouterProvider.otherwise('home');
    
  }]);