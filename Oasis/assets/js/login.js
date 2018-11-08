const statusSuccess = 200;
const path='http://localhost:8085/oasis';

$(document).ready(function(){
		//  LOGIN BUTTON
	  $('#btn-login').click(function(){
		var username = $('#username').val();
		var password = $('#password').val();

		var userdata = {
			  "username":username,
			  "password":password
		  }

		$.ajax({
		  type: 'POST',
			url: path+'/api/login',
		  contentType: 'application/json',
		  data: JSON.stringify(userdata),
		  dataType: 'json',
		  success: function(data){
			  if(data.code == statusSuccess){
				  alert(data.value.employeeNik);
				  window.location.href = '../../views/dashboard.html';
				  localStorage.setItem('id', data.value.employeeNik);
			  } else {
				 	  $(".login__error").css("display","block");
					  $(".login__error-message").text(data.value.errorMessage);
				 	  $( ".form__input").addClass( "form__input-error");
			  }
		  },
		  error: function(data){
			  alert("failed");
		  },
		  processData: false
	  });
	});
});