import {
	statusSuccess,
	path
} from '../base.js';

$(document).ready(function () {
	$('#btn-login').click(function () {
		var username = $('#username').val();
		var password = $('#password').val();

		var userdata = {
			"username": username,
			"password": password
		}

		$.ajax({
			type: 'POST',
			url: path + '/api/login',
			contentType: 'application/json',
			data: JSON.stringify(userdata),
			dataType: 'json',
			success: function (data) {
				window.location.href = '../../views/dashboard/dashboard.html';
				localStorage.setItem("username",data.value.username);
			},
			error: function (data) {
				console.log("failed");
				$(".login__error").css("display", "block");
				$(".login__error__message").text(data.responseJSON.value.errorMessage);
				$(".form__input").addClass("form__input-error");
			},
			processData: false
		});

	});

});