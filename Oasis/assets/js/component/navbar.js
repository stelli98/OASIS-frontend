$(document).ready(function(){
    
    $('.navbar__menu__toggle').hide();
  
    $(document).on('click','.navbar__user',function(){
        $('.navbar__menu__toggle').fadeToggle('slow');
    });

    $(document).on('click','.navbar__menu__toggle',function(){
        window.location.href='../../../components/changePassword/changePassword.html';
    });

});