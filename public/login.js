//login form keypress enter
$('#input-username').on('keypress', function (e) {
    if(e.which == 13){
        $('#loginbutton').click();
    }
});

//Submit form
$('#loginbutton').on('click', function () {
    var tempname = $('#input-username').val();
    if(tempname == ""){
        alert("Lütfen bir kullanıcı adı giriniz.");
    }else{
        $('#input-username').val('');
        socket.emit('reqlogin', tempname, function (status, message) {
            if (status){
                username = tempname;
                $('#loginModal').modal('hide');
                $('#username').text(username);
                $('#btn-navlogin').hide();
                $('#input-chat').focus();
                userlistlistener(); //Kullanıcı listesini okuma yetkisi
                globallistener(); //global mesaj yetkisi
            }else{
                alert(message);
            }
        })
    }
})

