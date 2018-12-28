import {
    statusSuccess,
    path
} from '../base.js';
$(document).ready(function () {

    var userData = JSON.parse(localStorage.getItem('userData'));

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
                    window.location.href = '../../views/dashboard/dashboard.html';
                },
                error: function (data) {
                    $('.change__password__error').css('display', 'block');
                    $('.form__input').addClass('form__input-error');
                    if(data.code==404){
                        $('.change__password__error__message').text("You already logged out");
                    }else if(data.code==401){
                        console.log("error");
                        $('.change__password__error__message').text("Incorrect old password");
                    }else if(data.code==400){
                        $('.change__password__error__message').text("Invalid input. Please try again !");
                    }
                }
            });
        }


    });


});


//