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

        var currentTab = '';


        if (index === -1) {
            var currentTabName = url.substr(40, url.length - 45).toUpperCase();
            currentTab = 'status=' + currentTabName + '&';

            $.ajax({
                type: 'GET',
                url: path + '/api/requests/list/my?' + currentTab + 'page=' + currPage,
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    listData(data, currPage);
                },
                error: function (data) {
                    alert('failed load data');
                }
            });
        } else {
            let keyword = url.substr(index + 16, url.length - 1);
            var currentTabName = url.substr(40, url.length-keyword.length-62).toUpperCase();
            currentTab = 'status=' + currentTabName + '&';

            $.ajax({
                type: 'GET',
                url: path + '/api/requests/list/my?' + currentTab + 'page=' + currPage + '&query=' + keyword,
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    listData(data, currPage);
                },
                error: function (data) {
                    alert('failed load data');
                }
            });
        }
    }

    function listData(data, currPage) {

        for (var index = 0; index < data.value.requests.length; index++) {
            var markup =
                `
            <div class='table-content table-content-request-my-no-btn-no'>${(data.paging.pageNumber-1)*10+index+1}</div>
            <div class='table-content table-content-request-my-no-btn-asset'>${data.value.requests[index].asset.name}</div>
            <div class='table-content table-content-request-my-no-btn-qty'>${data.value.requests[index].asset.quantity}</div>
            <div class='table-content table-content-request-my-no-btn-note'>${data.value.requests[index].request.note}</div>
            <div class='table-content table-content-request-my-no-btn-issuedBy'>${data.value.requests[index].modifier.name}</div>
            <div class='table-content table-content-request-my-no-btn-lastUpdate'>${dateFormatter(data.value.requests[index].request.updatedDate)}</div>
            `
            document.querySelector('.table-content-request-my-no-btn').insertAdjacentHTML('beforeend', markup);
        }

        var totalPage = data.paging.totalPage;
        $('.pagination').innerHTML = createPagination(totalPage, currPage);
    }

    $('.btn__search').click(function(){
        var keyword=$('.search__input').val();
        const url = window.location.href.split('.');
        var currentTabName = url[0].substr(40 , url[0].length-40);
        window.location.href = '../../views/request/myRequest'+currentTabName+'.html?search__request='+keyword;
    });

    $(document).on('click', '.pagination ul li', function (e) {
        let currPage = parseInt(e.target.closest('.pagination ul li').dataset.goto, 10);
        $('.table-content-request-my-no-btn').empty();
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