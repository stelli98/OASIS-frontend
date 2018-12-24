$(document).ready(function () {

    //   $(document).on('click', '.table-content-icon-accept', function() {
    //     $('.popup__part').load('../../components/popup/popup.html');
    //     $('.popup').css('display','block');
    //   });

    //   $('.popup__close-button').click(function(){
    //      $('.popup').css('display','none');
    //   });

    //   $('#btn-confimation-confirm').click(function(){
    //     $('.popup').css('display','none');
    //   });

    //   $('#btn-confimation-cancel').click(function(){
    //     $('.popup').css('display','none');
    //   });

    $(document).on('click', '.btn-confirmation-cancel, .popup__close__button ', function () {
        $('.popup').css('display', 'none');
    });

    if (window.location.href.indexOf('employee') != -1) {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8085/oasis/api/employees/usernames?username=-1',
            contentType: 'application/octet-stream',
            dataType: 'json',
            success: function (data) {
                for (var index = 0; index < data.length; index++) {
                    var markup = `<option class='option-popup' value='${data[index]}'>${data[index]}</option>`;
                    document.querySelector('.employee__list__supervisor').insertAdjacentHTML('beforeend', markup);
                }
            },
            error: function (data) {
                alert(data.error);
            }
        });
    }



});