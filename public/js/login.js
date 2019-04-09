var app = angular.module('naber', []);
app.controller('login', function($scope, $http) {
  $scope.username = "";
  $scope.password = "";
  $scope.submit = function () {
    $http({
      method : "POST",
        url : "/login",
        data:{'username': $scope.username, 'password': $scope.password},
        headers:{
          'Content-Type': 'application/json',
        }
    }).then(function mySuccess(response) {
        window.location="/index.html";
    }, function myError(response) {
        alert(response.statusText)
    });
  }
  
});