const statusSuccess = 200;
const path='http://localhost:8085/oasis';

$(document).ready(function(){

    $(".sidebar__part").load("../../components/sidebar/sidebar.html",function(){
        $(".navbar__part").load("../../components/navbar/navbar.html");
        $(".sidebar__icon__dashboard,  .sidebar__text__dashboard").removeClass("active");
        $(".sidebar__icon__asset,.sidebar__text__asset").addClass("active"); 
        $(".sidebar__icon__employee,.sidebar__text__employee").removeClass("active"); 
        $(".sidebar__icon__request,.sidebar__text__request").removeClass("active");
});

    $(".section .asset").removeClass("section asset");
    var sku=localStorage.getItem('sku');
    $.ajax({
        type: 'GET',
        url: path+'/api/assets/'+sku,
        contentType: 'application/octet-stream',
        dataType: 'json',
        success: function(data){
            if(data.code == statusSuccess){
                $('.text-asset__sku').text(data.value.assetSku);
                $('.text-asset__name').text(data.value.assetName);
                $('.text-asset__brand').text(data.value.assetBrand);
                $('.text-asset__type').text(data.value.assetType);
                $('.text-asset__location').text(data.value.assetLocation);
                $('.text-asset__qty').text(data.value.assetQuantity);
                $('.text-asset__price').text(data.value.assetPrice);

                
            } else {     
                console.log("error");
            }
        },
        error: function(data){
            alert("failed load data");
        }
    });

    $("#uploadAssetImage").change(function() {
        if (this.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('.asset__preview').css('background-image', 'url('+e.target.result +')');
                $('.asset__preview').hide();
                $('.asset__preview').fadeIn(650);
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    
});