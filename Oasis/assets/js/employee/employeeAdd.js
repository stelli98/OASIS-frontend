import { statusSuccess, path } from '../base.js';

$(document).ready(function () {
    $('.section .employee').removeClass('section employee');
    

    $('#form__employee__dob').datepicker({
        maxDate: new Date(2001,11,31),
        minDate: new Date(1958,12,1)
    });

    $('.employee__list__supervisor').hide();
    $('.employee__choose__supervisor').click(function(){
        $('.employee__list__supervisor').toggle();
    })

    $.ajax({
        type: 'GET',
        url: path + '/api/employees/usernames?username=-1', 
        contentType: 'application/octet-stream',
        dataType: 'json',
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

    $('#add__employee__btn').click(function () {
        var activeUser=localStorage.getItem('activeUser');
        var dob=$('#form__employee__dob').val();
        var name = $('#form__employee__name').val();
        var phone = $('#form__employee__phone').val();
        var jobTitle =  $('#form__employee__job').val();
        var division =  $('#form__employee__division').val();
        var location= $('#form__employee__location').val();
        var supervisorUsername=$('#form__employee__supervisor').text();
    
        var employeedata = {
            'username': activeUser,
            'employee': {
                'username':null,
                'name': name,
                'dob': dob,
                'password': '',
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
            cache: false,
            success: function (data) {
                window.location.href = '../../views/employee/employee.html';
            },
            error: function (data) {
                alert(data.error);
            }
        });
    });

});