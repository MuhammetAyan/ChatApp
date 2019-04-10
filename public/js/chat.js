  var username = "";
$(window).ready(function () {
  $('#chatpanel').hide();
})
  //login ------------------------------------------------------------
  var login = {};

  var app = angular.module('naber', []);
  app.controller('login', function($scope, $http) {
    $scope.username="";
    $scope.password = "";
  $scope.submit = function () {
    $http({
      method : "POST",
      url : "/login",
      data: {"username": $scope.username, "password": $scope.password},
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function mySuccess(response) {
        username = $scope.username;
        $('#loginpanel').hide();
        $('#chatpanel').show();
        chat.connect();
    }, function myError(response) {
      alert("hata");
    });
  }

});
  //chat-----------------------------------------------------------------
  var chat = {};
  chat.socket = null;
  chat.activetype = "all";
  chat.activename = "";

  //giriş yapma
  chat.connect = function () {
    chat.socket = io.connect();
    chat.socket.emit("reqsignin", username)
    chat.getuserlist();

    //user changed
    chat.socket.on('resuserchange', function (status, id, username) {
      if(status == "login"){
        userWrite(id, username, "user")
      }else if(status == "logout"){
        userDelete(id)
      }
    })

    //received messages
    chat.socket.on('resmessage', function (message, sender, type, name, date) {
      //Yetkisi varsa
      if (type == chat.activetype && name == chat.activename){
        messageWrite(message, sender, date);
      }else{
        alert("bildirim");
      }
    })
  }

  //kullanıcı listesi isteği
  chat.getuserlist = function () {
    if (chat.socket){
    chat.socket.emit("reqgetuserlist", function (data) {
      userlistRefresh(data);
    })
  }}

  //message send
  chat.sendmessage = function (message, username) {
    if (message != ''){
      chat.socket.emit("reqmessage", message, chat.activetype, chat.activename);
      messageWrite(message, 'Siz', Now())
    }
  }
  
  $('#send').on('click', function () {
    chat.sendmessage($('#chatinput').val());
    $('#chatinput').val('');
  })

  //odayı açma
  chat.open = function (type, username) {
    chat.activetype = type;
    chat.activename = username;
    $('#chatarea').html('');
    chat.socket.emit("reqgetmessage", chat.activetype, chat.activename, function (data) {
      messageListRefresh(data);
    });
  }

