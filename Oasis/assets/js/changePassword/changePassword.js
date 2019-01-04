import {
    statusNotAuthenticated,
    path
} from '../base.js';
$(document).ready(function () {

    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData==null){
        window.location.href='../../../../';
    }

    $('.btn__back').click(function () {
        window.history.back();
    });

    $('.change__password__btn__next').click(function () {

        var oldPassword = $('#old__password').val();
        var newPassword = $('#new__password').val();
        var confirmationPassword = $('#confirm__password').val();

        if (confirmationPassword != newPassword) {
            $('.change__password__error').css('display', 'block');
            $('.change__password__error__message').text("New password isn't same with the confirmation password");
        }else if(confirmationPassword.length <=6 || newPassword.length <=6 ) { 
            $('.change__password__error').css('display', 'block');
            $('.change__password__error__message').text("New password and confirm new password must be more than 6 characters");
        }else {

            var userdata = {
                'oldPassword': oldPassword,
                'newPassword': newPassword,
                'newPasswordConfirmation': confirmationPassword
            }

            $.ajax({
                type: 'POST',
                url: path + '/api/employees/change-password',
                contentType: 'application/json',
                data: JSON.stringify(userdata),
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    if(userData.role=="EMPLOYEE"){
                        window.location.href = '../../views/dashboard/dashboardMyRequest.html';
                    }else{
                        window.location.href = '../../views/dashboard/dashboardOthersRequest.html';
                    }
                },
                error: function (data) {
                    $('.change__password__error').css('display', 'block');
                    $('.form__input').addClass('form__input-error');
                    if(data.responseJSON.code==404){
                        $('.change__password__error__message').text("You already logged out");
                    }else if(data.responseJSON.code==401){
                        $('.change__password__error__message').text("Incorrect old password input");
                    }else if(data.responseJSON.code==400){
                        $('.change__password__error__message').text("Invalid input. Please try again !");
                    }else if (data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null) {
                        window.location.href = '../../../../';
                    }
                }
            });
        }


    });


});


//