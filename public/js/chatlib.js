function userlistRefresh(data) {
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