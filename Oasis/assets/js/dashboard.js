
$(document).ready(function(){


    var employeeId;

	$(".sidebar__part").load("../components/sidebar/sidebar.html",function(){
			$(".navbar__part").load("../components/navbar/navbar.html",function(){
				$(".status__part").load("../components/dashboardStatus/dashboardStatus.html",function(){
                     //loadDashboardStatus(employeeId);
					 $(".new-request__part").load("../components/dashboardNewAssetRequest/dashboardNewAssetRequest.html");
				});
			});
      });



	employeeId = localStorage.getItem('id');
	localStorage.removeItem('id');


    //   function loadDashboardStatus(){

    //     var totalNewAssetRequest=$("#status__new-asset-total").val();
    //     var totalPendingAssetRequest=$("#status__pending-asset-total").val();
    //     var totalAvailableAssetRequest=$("#status__available-asset-total").val();

    //     $.ajax({
    //         type: 'POST',
    //         url: 'http://localhost:8085/oasis/dashboardStatus',
    //         contentType: 'application/json',
    //         dataType: 'json',
    //         success: function(data){
    //             if(data.code == 200){
                    
    //             } else {
    //                      $(".login__error").css("display","block");
    //                     $(".login__error-message").text(data.value.errorMessage);
    //                      $( ".form__input").addClass( "form__input-error");
    //             }
    //         },
    //         error: function(data){
    //             alert("failed");
    //         },
    //         processData: false
    //     });
    //   }
});