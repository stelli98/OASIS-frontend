import {
    statusSuccess,
    path,
    elements
} from '../base.js';

$(document).ready(function () {
    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').removeClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').removeClass('active');
        $('.sidebar__text__request__my').removeClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').addClass('active');
        $('.sidebar__text__request__other').addClass('active');
    });


    var currPage = 1;
    var username = localStorage.getItem('activeUser');
    
    function loadAssetList(currPage) {
        $.ajax({
            type: 'GET',
            url: path + '/api/requests/list/' + username + '/others?page=' + currPage,
            contentType: 'application/octet-stream',
            dataType: 'json',
            success: function (data) {
                console.log(data);
                for (var index = 0; index < data.value.requests.length; index++) {
                    var markup =
                        `
                    <div class='table-content table-content-request-others-all-no'>${(data.paging.pageNumber-1)*10+index+1}</div>
                    <div class='table-content table-content-request-others-all-photo'>
                        <img src='${data.value.requests[index].employee.photo}' alt='photo' class='user__pic'>
                    </div>
                    <div class='table-content table-content-request-others-all-employee'>${data.value.requests[index].employee.name}</div>
                    <div class='table-content table-content-request-others-all-asset'>${data.value.requests[index].asset.name}</div>
                    <div class='table-content table-content-request-others-all-qty'>${data.value.requests[index].asset.quantity}</div>
                    <div class='table-content table-content-request-others-all-notes'>${data.value.requests[index].request.note}</div>
                    <div class='table-content table-content-request-others-all-status'>${data.value.requests[index].request.status}</div>
                    <div class='table-content table-content-request-others-all-lastUpdate'>${data.value.requests[index].request.updatedDate}</div>
                    `
                    document.querySelector('.table-content-request-others-all').insertAdjacentHTML('beforeend', markup);
                }

                var totalPage = data.paging.totalPage;
                $('.pagination').innerHTML = createPagination(totalPage, currPage);
            },
            error: function (data) {
                alert('failed load data');
            }
        });
    }

    $(document).on('click', '.pagination ul li', function (e) {
        let currPage = parseInt(e.target.closest('.pagination ul li').dataset.goto, 10);
        $('.table-content-request-others-all').empty();
        loadAssetList(currPage);
    })

    function createPagination(totalPage, currPage) {
        let str = '<ul>';
        let activate;
        let pageCutLow = currPage - 1;
        let pageCutHigh = currPage + 1;

        if (currPage > 1) {
            str += `<li class='page-item previous no' data-goto=${currPage-1}><a>Previous</a></li>`;
        }

        if (totalPage < 6) {
            for (let p = 1; p <= totalPage; p++) {
                if (currPage == p) {
                    activate = 'activate';
                } else {
                    activate = 'no';
                }

                str += `<li class='${activate}' data-goto=${p}><a>${p}</a></li>`;
            }
        } else {
            if (currPage > 2) {
                str += '<li class="no page-item" data-goto=1><a>1</a></li>';
                if (currPage > 3) {
                    str += `<li class='out-of-range' data-goto=${currPage-2}><a>...</a></li>`;
                }
            }

            if (currPage === 1) {
                pageCutHigh += 2;
            } else if (currPage === 2) {
                pageCutHigh += 1;
            }

            if (currPage === totalPage) {
                pageCutLow -= 2;
            } else if (currPage === totalPage - 1) {
                pageCutLow -= 1;
            }

            for (let p = pageCutLow; p <= pageCutHigh; p++) {
                if (p === 0) {
                    p += 1;
                }
                if (p > totalPage) {
                    continue
                }
                activate = currPage == p ? 'activate' : 'no';
                str += `<li class='page-item ${activate}' data-goto=${p}><a>${p}</a></li>`;
            }

            if (currPage < totalPage - 1) {
                if (currPage < totalPage - 2) {
                    str += `<li class='out-of-range' data-goto=${currPage+2}><a>...</a></li>`;
                }

                str += `<li class='page-item no' data-goto=${totalPage}><a>${totalPage}</a></li>`;
            }
        }

        if (currPage < totalPage) {
            str += `<li class='page-item next no' data-goto=${currPage+1}><a>Next</a></li>`;
        }
        str += '</ul>';

        document.querySelector('.pagination').innerHTML = str;
        return str;
    }

    loadAssetList(currPage);

})