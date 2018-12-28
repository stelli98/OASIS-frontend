$(document).ready(function(){
    
    var userData=JSON.parse(localStorage.getItem('userData'));

    $('.navbar__menu__toggle').hide();
  
    // $(document).on('click','.navbar__user',function(){
    //     $('.navbar__menu__toggle').fadeSh("");
    // });

    $('.navbar__user').click(function(){        
        $('.navbar__menu__toggle').toggle();      
    });

    $(document).on('click','.navbar__menu__toggle__change__password',function(){
        window.location.href='../../../views/changePassword/changePassword.html';
    });

    $(document).on('click','.navbar__menu__dropdown__logout',function(){
        console.log("Logout click");
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8085/oasis/api/logout',
            contentType: 'application/octet-stream',
            dataType: 'json',
            headers:{
                "X-Auth-Token":userData.authToken
            },
            success: function (data) {
                window.location.href='../../../../'
                localStorage.clear();
            },
            error: function (data) {

            }
        });
    });
    
    var userData=JSON.parse(localStorage.getItem('userData'));
   
    $('#navbar__username').text(userData.name);
    $('#navbar__picture').attr('src',userData.photo);

});