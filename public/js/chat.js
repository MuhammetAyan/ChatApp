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

  //giriş yapma
  $scope.chat.connect = function () {
    $scope.chat.socket = io.connect();
    $scope.chat.socket.emit("reqsignin", $scope.username)
    $scope.chat.getuserlist();

    $scope.chat.socket.on('resuserchange', function (status, id, username) {
      if(status == "login"){
        //$scope.userlist.push({'id': id, 'username': username});
        userWrite(id, username)
      }else if(status == "logout"){
        userDelete(id)
        //$scope.userlist = $scope.userlist.filter(x=> x.id != id)
      }
    })
  }

  $scope.chat.getuserlist = function () {
    if ($scope.chat.socket){
    $scope.chat.socket.emit("reqgetuserlist", function (data) {
      userlistRefresh(data);
    })

  }}
  
});
