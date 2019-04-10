function Now() {
    var now = new Date();
    return now.getHours() + ":" + now.getMinutes()
}

function userlistRefresh(data) {
    $('#userlist').html('');
    userWrite("", "Herkes", "all")
    data.forEach(element => {
        userWrite(element.id, element.username, element.type)
    });
}

function userWrite(id, username, type) {
    html = '<button class="btn btn-light" data="' + type + '" id="' + id +
    '" onclick="chat.open(\'' + type + "\',\'" + username + '\')">' + username +
    '</button>';
    $('#userlist').append(html);
}

function userDelete(id) {
    $('#' + id).remove();
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

function messageListRefresh(data) {
    $('#chatarea').html('');
    data.forEach(element => {
        alert(element.message);
        messageWrite(element.message, element.sender, element.date)
    });
}

//Design-----------------------------------------------------------------
$('#chatinput').on('keypress', function (e) {
    if(e.which == 13){
        $('#send').click();
    }
})
