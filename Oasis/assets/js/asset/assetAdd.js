import {
    path,
    statusNotAuthenticated
} from '../base.js';
import * as validate from '../validation.js';

$(document).ready(function () {

    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData==null){
        window.location.href='../../../../';
    }

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

    $('#add__asset__btn').click(function () {
        var assetName = $('#form__asset__name').val();
        var assetLocation = $('#form__asset__location').val();
        var assetBrand = $('#form__asset__brand').val();
        var assetType = $('#form__asset__type').val();
        var assetQty = parseInt($('#form__asset__qty').val(),10);
        var assetPrice = parseFloat($('#form__asset__price').val());
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

        if ($('#input__error__assetName').text() == "" &&
            $('#input__error__location').text() == "" &&
            $('#input__error__brand').text() == "" &&
            $('#input__error__type').text() == "" &&
            $('#input__error__quantity').text() == "" &&
            $('#input__error__price').text() == "" && 
            $('#input__error__assetImage').text()=="") {
            addNewAsset(formData);
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
                "X-Auth-Token": userData.authToken
            },
            success: function () {
                window.location.href = '../../views/asset/asset.html';
            },
            error: function (data) {
                if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                    window.location.href='../../../../';
                }
            }
        });
    }

});