var socket = io.connect();
var username = "";
var activepage = "globalPanel";

function writemessage(message, source, nowtext, page=""){
    if(message != ""){
        var classvalue = ""
        switch (source) {
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
        html = '<div class="' + classvalue + '">' +
        '<div class="badge badge-dark">' + source + '</div>' +
        '<div class="badge badge-secondary">'+ nowtext +'</div>'+
        '<p class="mb-1">' + message + '</p>'+
        '</div>';
        if(page == "")
            $('#' + activepage).append(html);
        else
            $('#' + page).append(html);
    }
}

function writeuser(id, username){
    html= '<a class="dropdown-item" href="#" id=' + id +
    ' onclick="openuser(\'' + id + '\', \'' + username +'\')">' + username + '</a>';
    $('#userlist').append(html);
}

function deleteuser(id){
    $('#' + id).remove();
}

function openuser(id, username) {
    $('.baritem').removeClass("active");
    html = '<a class="nav-item nav-link baritem active" href="#" id="chatbar' + id + '">' + username +'</a>';
    $('#chatbar').append(html);
}

//designer

//chat input'a enterlanınca gönder butonuna bas
$('#input-chat').on('keypress', function (e) {
    if(e.which == 13){
        $('#send-btn').click();
    }
})