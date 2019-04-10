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
  $scope.chat.activetype = "all";
  $scope.chat.activename = "";

  //giriş yapma
  $scope.chat.connect = function () {
    $scope.chat.socket = io.connect();
    $scope.chat.socket.emit("reqsignin", $scope.username)
    $scope.chat.getuserlist();

    //user changed
    $scope.chat.socket.on('resuserchange', function (status, id, username) {
      if(status == "login"){
        userWrite(id, username)
      }else if(status == "logout"){
        userDelete(id)
      }
    })

    //received messages
    $scope.chat.socket.on('resmessage', function (message, sender, type, name, date) {
      //Yetkisi varsa
      if (type == $scope.chat.activetype && name == $scope.chat.activename){
        messageWrite(message, sender, date);
      }else{
        alert("bildirim");
      }
    })
  }

  //kullanıcı listesi isteği
  $scope.chat.getuserlist = function () {
    if ($scope.chat.socket){
    $scope.chat.socket.emit("reqgetuserlist", function (data) {
      userlistRefresh(data);
    })
  }}

  //message send
  $scope.chat.sendmessage = function (message, username) {
    if (message != ''){
      $scope.chat.socket.emit("reqmessage", message, $scope.chat.activetype, $scope.chat.activename)
      messageWrite(message, 'Siz', Now())
    }
  }
  
  $('#send').on('click', function () {
    $scope.chat.sendmessage($('#chatinput').val());
    $('#chatinput').val('');
  })
  
});
