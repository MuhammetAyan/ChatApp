var app = angular.module('naber', []);
app.controller('chat',  function($scope, $http) {
  $scope.username = "";

  //login ------------------------------------------------------------
  $scope.login = {};
  $scope.login.username = "";
  $scope.login.password = "";

  $scope.login.submit = function () {
    $http({
      method : "POST",
        url : "/login",
        data:{'username': $scope.login.username, 'password': $scope.login.password},
        headers:{
          'Content-Type': 'application/json',
        }
    }).then(function mySuccess(response) {
        $scope.username = $scope.login.username;
        $scope.chat.connect();
    }, function myError(response) {
        alert(response.statusText)
    });
  }
  //chat-----------------------------------------------------------------
  $scope.chat = {};
  $scope.chat.socket = null;
  $scope.chat.connect = function () {
    $scope.chat.socket = io.connect();
    
  }
  
});
