import {path} from '../base.js';

$(document).ready(function () {
	$('#btn-login').click(function () {
		// var username = $('#username').val();
		// var password = $('#password').val();

		// $.ajax({
		// 	type: 'POST',
		// 	url: path + '/api/login',
		// 	cache:false,
		// 	headers: {
		// 		'Authorization': 'Basic ' + btoa(username + ':' + password),
		// 		'Access-Control-Allow-Credentials' : true
		// 	},
		// 	xhrFields: {
		// 		withCredentials: true
		// 	},
		// 	success: function (data) {

		// 		// console.log(data);
		// 		window.location.href = '../../views/dashboard/dashboard.html';
		// 		 localStorage.setItem('activeUser',data.value.username);
		// 	},
		// 	error: function(XMLHttpRequest, textStatus, errorThrown) {
		// 		alert(textStatus, errorThrown);
			 
		// 		// $('.login__error').css('display', 'block');
		// 		// $('.login__error__message').text(data.responseJSON.value.errorMessage);
		// 		// $('.form__input').addClass('form__input-error');
		// 	},
		// });

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
				// localStorage.setItem("username",data.value.username);
				localStorage.setItem("activeUser",data.value.username);
			},
			error: function (data) {
				console.log(data);
				$(".login__error").css("display", "block");
				$(".login__error__message").text(data.responseJSON.value.errorMessage);
				$(".form__input").addClass("form__input-error");
			},
			processData: false
		});

		// localStorage.setItem("activeUser","jonathan");
		// window.location.href = '../../views/dashboard/dashboard.html';
	});

});