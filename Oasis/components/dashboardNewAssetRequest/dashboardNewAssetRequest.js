$(document).ready(function(){

  $(".action-button-accept").click(function () {
       $('.popup').css("display","block");
  });

  $(".popup__close-button").click(function(){
     $('.popup').css("display","none");
  });

  $("#btn-confimation-confirm").click(function(){
    $('.popup').css("display","none");
 });

 $("#btn-confimation-cancel").click(function(){
  $('.popup').css("display","none");
});

});