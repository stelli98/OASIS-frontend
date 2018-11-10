
    $(document).ready(function(){
        $(".section .asset").removeClass("section asset");
        

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

        $('#add__asset-btn').click(function(){
            var employeeNik =localStorage.getItem('id');
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
                type:'POST',
                url:path+'/api/assets/save',
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