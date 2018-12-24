import { statusSuccess, path } from '../base.js';

$(document).ready(function () {
    var username=localStorage.getItem('selectedUser');
    $('.section .employee').removeClass('section employee');
    
    $('#form__employee__dob').datepicker({
        maxDate: new Date(2001,11,31),
        minDate: new Date(1958,12,1)
    });

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').removeClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').addClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').removeClass('active');
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
    
    $(document).on( 'click', '.employee__list__supervisor option', function() {
        var selectedSuperior=$(this).html();
        $('#form__employee__supervisor').val(selectedSuperior);
        var textHtml=selectedSuperior+'<svg class="employee__choose__supervisor__btn"><use xlink:href="../../assets/img/sprite.svg#icon-drop-down-arrow"></use></svg>'
        $('#form__employee__supervisor').html(textHtml);
        $('.employee__list__supervisor').toggle();
    });   
    
    $.ajax({
        type: 'GET',
        url: path + '/api/employees/' +username ,
        contentType: 'application/octet-stream',
        dataType: 'json',
        success: function (data) {
            if (data.code == statusSuccess) {
                console.log(data);
                $('.employee__edit__name > input:text').val(data.value.name);
                $('.employee__edit__dob > input:text').val(data.value.dob);
                $('.employee__edit__job > input:text').val(data.value.jobTitle);
                $('.employee__edit__division > input:text').val(data.value.division);
                $('#form__employee__supervisor').val(data.value.supervisor.username);
                var markup=
                `<p clas='employee__chosen__supervisor'>${data.value.supervisor.username}</p>`
                document.querySelector('#form__employee__supervisor').insertAdjacentHTML('afterbegin',markup);
                $('.employee__edit__location > input:text').val(data.value.location);
                $('.employee__edit__phone > input:text').val(data.value.phone);
                $('.employee__preview').css('background-image', 'url(' + data.value.photo+ ')');
            } else {
                console.log('error');
            }
        },
        error: function (data) {
            alert('failed load data');
        }
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

    $('#edit__employee__btn').click(function () {
        var activeUser=localStorage.getItem('activeUser');
        var dob=$('#form__employee__dob').val();
        var name = $('#form__employee__name').val();
        var phone = $('#form__employee__phone').val();
        var jobTitle =  $('#form__employee__job').val();
        var division =  $('#form__employee__division').val();
        var location= $('#form__employee__location').val();
        var supervisorUsername=$('#form__employee__supervisor').val();
       
        var employeedata = {
            'username': activeUser,
            'employee': {
                'username':username,
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