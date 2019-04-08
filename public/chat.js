var app = angular.module('myApp', []);
app.controller('chat', function($scope, $http) {
    $scope.socket = io.connect();
    $scope.username = "";
    $scope.globalMessages = [];
    $scope.rooms = [];

    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });
    $scope.kullanicilar = function(){
        $scope.socket.emit('reqgetusers', function(data){
            $scope.users = data.split("|")
            
        });
     
    }
    
    $scope.herkeseMesajGonder = function (message) {
        $scope.socket.emit('reqglobal', message, $scope.username, function(data){
             var now = new Date();
             var nowtext = now.getHours() + ":" + now.getMinutes()
             $scope.globalMessages.push({'index':$scope.globalMessages.length, 'source':'Siz', 'message':data, 'date':nowtext})
        })
        var now = new Date();
        var nowtext = now.getHours() + ":" + now.getMinutes()
        $scope.globalMessages.push({'index':$scope.globalMessages.length, 'source':'Siz', 'message':message, 'date':nowtext})
        $scope.text = ""
    }

    $scope.OdayaMesajGonder = function (room, message) {
        socket.to(room).emit('oda' + room, message)
    }

    $scope.OzelMesajGonder = function (id, message) {
        socket.to(id).emit('ozel' + id, message)
    }

    // Arkayüzden tetiklenen mesajları yakalamak için
    $scope.socket.on('resglobal', function(data, source, date) {
        $scope.globalMessages.push({'index':$scope.globalMessages.length, 'source': source, 'message':data, 'date': date})
        $scope.$apply();
    })

});