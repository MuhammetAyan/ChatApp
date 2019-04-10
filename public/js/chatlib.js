function Now() {
    var now = new Date();
    return now.getHours() + ":" + now.getMinutes()
}

function userlistRefresh(data) {
    $('#userlist').html('');
    html = '<div class="" id="all">Herkes</div>';
    $('#userlist').append(html);
    data.forEach(element => {
        html = '<div class="" id="user' + element.id +'">' + element.username +'</div>';
        $('#userlist').append(html);
    });
}

function userWrite(id, username) {
    html = '<div class="" id="user' + id +'">' + username +'</div>';
    $('#userlist').append(html);
}

function userDelete(id) {
    html = '<div class="" id="user' + id +'">' + username +'</div>';
    $('#user' + id).remove();
}

function messageWrite(message, sender, date) {
    if(message != ""){
        var classvalue = ""
        switch (sender) {
            case "Siz":
                classvalue = "alert-success text-right";
                break;
            case "":
                classvalue = "alert-secondary text-center";
                break;
            default:
                classvalue = "alert-warning";
                break;
        }
    }
    html ='<div class="' + classvalue + '">' +
    '<div class="badge badge-dark">' + sender + '</div>' +
    '<div class="badge badge-secondary">'+ date +'</div>'+
    '<p class="mb-1">' + message + '</p>'+
    '</div>';
    $('#chatarea').append(html);
}

//Design-----------------------------------------------------------------
$('#chatinput').on('keypress', function (e) {
    if(e.which == 13){
        $('#send').click();
    }
})
