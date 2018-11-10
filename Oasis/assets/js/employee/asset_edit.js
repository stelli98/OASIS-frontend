const statusSuccess = 200;
const path='http://localhost:8085/oasis';
$(document).ready(function(){
    $(".section .asset").removeClass("section asset");

    $(".sidebar__part").load("../../components/sidebar/sidebar.html",function(){
        $(".navbar__part").load("../../components/navbar/navbar.html");
        $(".sidebar__icon__dashboard,  .sidebar__text__dashboard").removeClass("active");
        $(".sidebar__icon__asset,.sidebar__text__asset").addClass("active"); 
        $(".sidebar__icon__employee,.sidebar__text__employee").removeClass("active"); 
        $(".sidebar__icon__request,.sidebar__text__request").removeClass("active");
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
    
    
    var sku=localStorage.getItem('sku');
    var employeeNik =localStorage.getItem('id');

    $.ajax({
        type: 'GET',
        url: path+'/api/assets/'+sku,
        contentType: 'application/octet-stream',
        dataType: 'json',
        success: function(data){
            console.log(data);
            if(data.code == statusSuccess){
                $('.asset__edit__name > input:text').val(data.value.assetName);
                $('.asset__edit__brand > input:text').val(data.value.assetBrand);
                $('.asset__edit__type > input:text').val(data.value.assetType);
                $('.asset__edit__location > input:text').val(data.value.assetLocation);
                $('.asset__edit__qty > input[type="number"]').val(data.value.assetQuantity);
                $('.asset__edit__price > input[type="number"]').val(data.value.assetPrice);
            } else {     
                console.log("error");
            }
        },
        error: function(data){
            alert("failed load data");
        }
    });

    $('#edit__asset-btn').click(function(){
        var assetName =$('#form__asset-name').val();
        // var assetPhoto= null;
        var assetLocation=$('#form__asset-location').val();
        var assetBrand=$('#form__asset-brand').val();
        var assetType=$('#form__asset-type').val();
        var assetQty= parseInt($('#form__asset-qty').val());
        var assetPrice= parseFloat($('#form__asset-price').val());

        var assetdata={
            "employeeNik":employeeNik,
            "asset":{
                "assetSku":sku,
                "assetName":assetName,
                //"assetPhoto" : assetPhoto,
                "assetLocation" :assetLocation,
                "assetBrand" : assetBrand,
                "assetType" : assetType,
                "assetQty" : assetQty,
                "assetPrice" :assetPrice
            }
        }
        console.log(assetdata);
        $.ajax({
            type:'PUT',
            url:path+'/api/assets/save?'+sku,
            data: JSON.stringify(assetdata),
            contentType: 'application/json',
            dataType: 'json',
            success: function(data){
                window.location.href='../../views/asset/asset.html'
            },
            error:function(data){
                alert(data.error);
            }
        });
    });



});