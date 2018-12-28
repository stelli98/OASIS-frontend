import {
    statusSuccess,
    path,
    elements,
    dateFormatter
} from '../base.js';

$(document).ready(function () {


    var userData = JSON.parse(localStorage.getItem('userData'));
    var currPage = 1;

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').removeClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').removeClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').addClass('active');
        $('.sidebar__text__request__my').addClass('active');
    });

    function loadAssetList(currPage) {
        const url = window.location.href;
        const index = url.indexOf('search__request');

        if (index === -1) {
            $.ajax({
                type: 'GET',
                url: path + '/api/requests/list/my?status=REQUESTED&page=' + currPage,
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    console.log(data);
                    for (var index = 0; index < data.value.requests.length; index++) {
                        var markup =
                            `
                    <div class='table-content table-content-request-my-with-btn-no'>${(data.paging.pageNumber-1)*10+index+1}</div>
                    <div class='table-content table-content-request-my-with-btn-asset'>${data.value.requests[index].asset.name}</div>
                    <div class='table-content table-content-request-my-with-btn-qty'>${data.value.requests[index].asset.quantity}</div>
                    <div class='table-content table-content-request-my-with-btn-note'>${data.value.requests[index].request.note}</div>
                    <div class='table-content table-content-request-my-with-btn-issuedBy'>${data.value.requests[index].modifier.name}</div>
                    <div class='table-content table-content-request-my-with-btn-lastUpdate'>${dateFormatter(data.value.requests[index].request.updatedDate)}</div>

                    <div class='table-content table-content-request-my-with-btn-actionBtn'
                        id='table-content-request-my-with-btn-actionBtn-cancel' data-value=${data.value.requests[index].request.id}>
                        <a href='#' id='action-button-reject'>
                            <svg class='action-icon action-icon-reject'>
                                <use xlink:href='../../assets/img/sprite.svg#icon-unchecked'></use>
                            </svg>
                        </a>
                    </div>
                    `
                        document.querySelector('.table-content-request-my-with-btn').insertAdjacentHTML('beforeend', markup);
                    }

                    var totalPage = data.paging.totalPage;
                    $('.pagination').innerHTML = createPagination(totalPage, currPage);
                },
                error: function (data) {
                    alert('failed load data');
                }
            });
        }else{
            let keyword = url.substr(index + 16, url.length - 1);
            $.ajax({
                type: 'GET',
                url: path + '/api/requests/list/my?status=REQUESTED&page=' + currPage+'&query='+keyword,
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    console.log(data);
                    for (var index = 0; index < data.value.requests.length; index++) {
                        var markup =
                            `
                    <div class='table-content table-content-request-my-with-btn-no'>${(data.paging.pageNumber-1)*10+index+1}</div>
                    <div class='table-content table-content-request-my-with-btn-asset'>${data.value.requests[index].asset.name}</div>
                    <div class='table-content table-content-request-my-with-btn-qty'>${data.value.requests[index].asset.quantity}</div>
                    <div class='table-content table-content-request-my-with-btn-note'>${data.value.requests[index].request.note}</div>
                    <div class='table-content table-content-request-my-with-btn-issuedBy'>${data.value.requests[index].modifier.name}</div>
                    <div class='table-content table-content-request-my-with-btn-lastUpdate'>${dateFormatter(data.value.requests[index].request.updatedDate)}</div>

                    <div class='table-content table-content-request-my-with-btn-actionBtn'
                        id='table-content-request-my-with-btn-actionBtn-cancel' data-value=${data.value.requests[index].request.id}>
                        <a href='#' id='action-button-reject'>
                            <svg class='action-icon action-icon-reject'>
                                <use xlink:href='../../assets/img/sprite.svg#icon-unchecked'></use>
                            </svg>
                        </a>
                    </div>
                    `
                        document.querySelector('.table-content-request-my-with-btn').insertAdjacentHTML('beforeend', markup);
                    }

                    var totalPage = data.paging.totalPage;
                    $('.pagination').innerHTML = createPagination(totalPage, currPage);
                },
                error: function (data) {
                    alert('failed load data');
                }
            });
        }
    }

    $('.btn__search').click(function(){
        var keyword=$('.search__input').val();
        window.location.href = '../../views/request/myRequestRequested.html?search__request='+keyword;
    });

    $(document).on('click', '.pagination ul li', function (e) {
        let currPage = parseInt(e.target.closest('.pagination ul li').dataset.goto, 10);
        $('.table-content-request-my-with-btn').empty();
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


    $(document).on('click', '#table-content-request-my-with-btn-actionBtn-cancel', function (e) {
        var selectedRequest = e.target.closest('#table-content-request-my-with-btn-actionBtn-cancel').dataset.value;
        var selectedRequestedData = {
            '_id': selectedRequest,
            'sku': '',
            'quantity': 0,
            'status': 'Cancelled',
            'requestNote': '',
            'transactionNote': '',
        }
        var arraySelectedRequest = [selectedRequestedData];

        var cancelRequestedData = {
            'username': username,
            'requests': arraySelectedRequest
        }

        $.ajax({
            type: 'POST',
            url: path + '/api/requests/save',
            data: JSON.stringify(cancelRequestedData),
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                "X-Auth-Token": userData.authToken
            },
            success: function (data) {
                console.log(data);
                if (data.code == 201) {
                    console.log('sucess');
                    window.location.href = '../../views/request/myRequestCancelled.html';
                }
            },
            error: function (data) {
                alert('failed load data');
                console.log(data);
            }
        });
    });

    loadAssetList(currPage);

})