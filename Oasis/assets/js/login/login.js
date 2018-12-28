import {
	path
} from '../base.js';

$(document).ready(function () {
	$('#btn-login').click(function () {
		var username = $('#username').val();
		var password = $('#password').val();


		var jqxhr = $.ajax({
			type: 'POST',
			url: path + '/api/login',
			headers: {
				"Authorization": "Basic " + btoa(username + ":" + password)
			},
			success: function (data) {
				var userData = {
					"authToken": jqxhr.getResponseHeader('X-Auth-Token'),
					"name": data.value.username,
					"photo": data.value.photo,
					"role": data.value.role
				}
				localStorage.setItem('userData',JSON.stringify(userData));
				if(userData.role=="EMPLOYEE"){
					window.location.href = '../../views/dashboard/dashboardMyRequest.html';
				}else{
					window.location.href = '../../views/dashboard/dashboardOthersRequest.html';
				}
				
			},
			error: function (data) {
				console.log(data);
				$('.login__error').css('display', 'block');
				$('.login__error__message').text(data.responseJSON.value.errorMessage);
				$('.form__input').addClass('form__input-error');
			},

		});



	});



});