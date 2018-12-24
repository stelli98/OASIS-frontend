import {statusSuccess,path} from '../base.js';
$(document).ready(function(){

    $('.btn__back').click(function(){
        window.history.back();
    });

    $('.change__password__btn__next').click(function(){
        
        var username=localStorage.getItem('activeUser');
        var oldPassword=$('#old__password').val();
        var newPassword=$('#new__password').val();
        var confirmationPassword=$('#confirm__password').val();

        var userdata={
            'username':username, 
            'oldPassword':oldPassword,
            'newPassword':newPassword,
            'newPasswordConfirmation':confirmationPassword
        }
        console.log(userdata);

        $.ajax({
			type: 'POST',
			url: path + '/api/employees/change-password',
			contentType: 'application/json',
			data: JSON.stringify(userdata),
			dataType: 'json',
			success: function (data) {
				window.location.href = '../../views/dashboard/dashboard.html';
			},
			error: function (data) {
				console.log('failed');
				$('.change__password__error').css('display', 'block');
				$('.change__password__error__message').text(data.responseJSON.value.errorMessage);
				$('.form__input').addClass('form__input-error');
			}
		});
    });


    
    
});