import { statusSuccess, path } from '../base.js';

$(document).ready(function () {
    $('.section .asset').removeClass('section asset');

    $('#uploadEmployeeImage').change(function () {
        if (this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.employee__preview').css('background-image', 'url(' + e.target.result + ')');
                localStorage.setItem('file', e.target.result);
                $('.employee__preview').hide();
                $('.employee__preview').fadeIn(650);
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    $('#add__asset__btn').click(function () {
        var username=localStorage.getItem('activeUser');
        var assetName = $('#form__asset__name').val();
        var assetLocation = $('#form__asset__location').val();
        var assetBrand = $('#form__asset__brand').val();
        var assetType = $('#form__asset__type').val();
        var assetQty = parseInt($('#form__asset__qty').val());
        var assetPrice = parseFloat($('#form__asset__price').val());
        var assetExpendable=$('#form__asset__expendable').val();
    
        if(assetExpendable=='yes'){
            assetExpendable=true;
        }else{
            assetExpendable=false;
        }

        var assetdata = {
            'username': username,
            'asset': {
                'sku':null,
                'name': assetName,
                'location': assetLocation,
                'brand': assetBrand,
                'type': assetType,
                'quantity': assetQty,
                'price': assetPrice,
                'expendable':assetExpendable
            }
        }
        console.log(assetdata);
        var form = document.getElementById('uploadAssetImageForm')[0];
        var formData = new FormData(form);

        formData.append('photos', form.files[0]);
        formData.append('data', JSON.stringify(assetdata));

        $.ajax({
            type: 'POST',
            enctype: 'multipart/form-data',
            url: path + '/api/assets/save',
            data: formData,
            processData: false,
            contentType: false,
            cache: false,
            success: function (data) {
                window.location.href = '../../views/asset/asset.html';
            },
            error: function (data) {
                alert(data.error);
            }
        });
    });

});