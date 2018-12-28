import { statusSuccess, path } from '../base.js';
import * as validate from '../validation.js';

$(document).ready(function () {
    var userData=JSON.parse(localStorage.getItem('userData'));
    $('.section .employee').removeClass('section employee');

    
    var token=localStorage.getItem('authToken');
    var basicAuth=localStorage.getItem('activeBasicAuth');

    $('.employee__list__supervisor').hide();
    $('.employee__choose__supervisor').click(function(){
        $('.employee__list__supervisor').toggle();
    })

    $.ajax({
        type: 'GET',
        url: path + '/api/employees/usernames?username=-1', 
        contentType: 'application/octet-stream',
        dataType: 'json',
        headers: {
            "X-Auth-Token":userData.authToken
        },
        success: function (data) {
            for(var index=0;index<data.length;index++){
                var markup=`<option class='option' value='${data[index]}'>${data[index]}</option>`;
                document.querySelector('.employee__list__supervisor').insertAdjacentHTML('beforeend', markup);        
            }

        },
        error: function (data) {
            alert(data.error);
        }
    });
    
    $(document).on( 'click', '.employee__list__supervisor option', function(e) {
        var selectedSuperior=$(this).html();
        var textHtml=selectedSuperior+'<svg class="employee__choose__supervisor__btn"><use xlink:href="../../assets/img/sprite.svg#icon-drop-down-arrow"></use></svg>'
        $('#form__employee__supervisor').html(textHtml);
        $('.employee__list__supervisor').toggle();
    });

    $('#uploadEmployeeImage').change(function (e) {
        if (this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.employee__preview').css('background-image', 'url(' + e.target.result + ')');
                localStorage.setItem('file', e.target.result);
                $('.employee__preview').hide();
                $('.employee__preview').fadeIn(650);
            }
            reader.readAsDataURL(this.files[0]);
            $('#input__error__employeePhoto').text(validate.isImageExtension(e.target.files[0].name));
        }
    });

    $('#add__employee__btn').click(function () {
        var dob=$('#form__employee__dob').val();
        var name = $('#form__employee__name').val();
        var phone = $('#form__employee__phone').val();
        var jobTitle =  $('#form__employee__job').val();
        var division =  $('#form__employee__division').val();
        var location= $('#form__employee__location').val();
        var supervisorUsername=$('#form__employee__supervisor').text();
    
        
        $('#input__error__employeeName').text(validate.isAlphabet(name));
        $('#input__error__phone').text(validate.isPhoneNumber(phone));
        $('#input__error__jobTitle').text(validate.isAlphabet(jobTitle));
        $('#input__error__division').text(validate.isAlphabet(division));
        $('#input__error__location').text(validate.isAlphabet(location));
        $("#input__error__supervisor").text(validate.isSelectedSupervisor(supervisorUsername));

        var employeedata = {
            'employee': {
                'username':null,
                'name': name,
                'dob': dob,
                'phone': phone,
                'location':location,
                'jobTitle': jobTitle,
                'division': division,
                'supervisorUsername':supervisorUsername
            }
        }

        var form = document.getElementById('uploadEmployeeImageForm')[0];
        var formData = new FormData(form);

        formData.append('photo', form.files[0]);
        formData.append('data', JSON.stringify(employeedata));
        console.log(employeedata);
        console.log(formData);
        $.ajax({
            type: 'POST',
            enctype: 'multipart/form-data',
            url: path + '/api/employees/save',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                "X-Auth-Token":userData.authToken
            },            success: function (data) {
                window.location.href = '../../views/employee/employee.html';
            },
            error: function (data) {
                alert(data.error);
            }
        });
    });

});