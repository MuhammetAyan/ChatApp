$(window).on('load', function(){
    $('#myModal').modal('show');
    $('#username').focus();

    $("#input").on('keypress',function(e) {
        if(e.which == 13) {
            $("#submit").click();
            $("#username").focus();
        }
    });
    $("#username").on('keypress',function(e) {
        if(e.which == 13) {
            $("#loginbutton").click();
        }
    });
  }); 

