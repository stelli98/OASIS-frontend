
$(document).ready(function(){
    
    var userData=JSON.parse(localStorage.getItem('userData'));    
    if(userData==null){
        window.location.href='../../../../';
    }

    $('.navbar__menu__toggle').hide();

    $('.navbar__user').click(function(){        
        $('.navbar__menu__toggle').toggle();      
    });

    $(document).on('click','.navbar__menu__toggle__change__password',function(){
        window.location.href='../../../views/changePassword/changePassword.html';
    });
    
    $(document).on('click','.navbar__menu__dropdown__logout',function(){
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8085/oasis/api/logout',
            contentType: 'application/octet-stream',
            dataType: 'json',
            headers:{
                "X-Auth-Token":userData.authToken
            },
            success: function () {
                window.location.href='../../../../';
                localStorage.clear();
            },
            error: function (data) {
                if (data.responseJSON.value.errorCode=="UNAUTHENTICATED_USER" || userData==null) {
                    window.location.href = '../../../../';
                }
            }
        });
    });
    


    $('#navbar__username').text(userData.name);
    $('#navbar__picture').attr('src',userData.photo);

});