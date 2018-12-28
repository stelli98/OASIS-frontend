import {
    statusSuccess,
    path
} from '../base.js';
import * as validate from '../validation.js';

$(document).ready(function () {

    var userData=JSON.parse(localStorage.getItem('userData'));

    $('.section .asset').removeClass('section asset');

    $('#uploadAssetImage').change(function (e) {
        if (this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.asset__preview').css('background-image', 'url(' + e.target.result + ')');
                localStorage.setItem('file', e.target.result);
                $('.asset__preview').hide();
                $('.asset__preview').fadeIn(650);
            }
            reader.readAsDataURL(this.files[0]);
            $('#input__error__assetImage').text(validate.isImageExtension(e.target.files[0].name));
        }

        
        
    });

    function addNewAsset(formData) {
        $.ajax({
            type: 'POST',
            enctype: 'multipart/form-data',
            url: path + '/api/assets/save',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                "X-Auth-Token":userData.authToken
            },
            success: function (data) {
                // window.location.href = '../../views/asset/asset.html';
                // console.log(data);
                alert("Success");
            },
            error: function (data) {
                // alert(data);
                console.log(data);
            }
        });
        // alert("Finish!");
    }

    $('#add__asset__btn').click(function () {
        var assetName = $('#form__asset__name').val();
        var assetLocation = $('#form__asset__location').val();
        var assetBrand = $('#form__asset__brand').val();
        var assetType = $('#form__asset__type').val();
        var assetQty = $('#form__asset__qty').val();
        var assetPrice = $('#form__asset__price').val();
        var assetExpendable = $('#form__asset__expendable').val();

        if (assetExpendable == 'yes') {
            assetExpendable = true;
        } else {
            assetExpendable = false;
        }

        $('#input__error__assetName').text(validate.isAlphabetNumeric(assetName));
        $('#input__error__location').text(validate.isAlphabetNumeric(assetLocation));
        $('#input__error__brand').text(validate.isAlphabetNumeric(assetBrand));
        $('#input__error__type').text(validate.isAlphabetNumeric(assetType));
        $('#input__error__qty').text(validate.isNumber(assetQty));
        $('#input__error__price').text(validate.isNominal(assetPrice));

        var assetData = {
            'asset': {
                'sku': null,
                'name': assetName,
                'location': assetLocation,
                'brand': assetBrand,
                'type': assetType,
                'quantity': assetQty,
                'price': assetPrice,
                'expendable': assetExpendable
            }
        }

        var form = document.getElementById('uploadAssetImageForm')[0];
        var formData = new FormData(form);

        formData.append('images', form.files[0]);
        formData.append('data', JSON.stringify(assetData));
        addNewAsset(formData);
    });

});