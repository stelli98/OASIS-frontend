var statusSuccess = 200;
var path='http://localhost:8085/oasis';

$(document).ready(function(){
    $(".section .asset").removeClass("section asset");
    
	$(".sidebar__part").load("../../components/sidebar/sidebar.html",function(){
            $(".navbar__part").load("../../components/navbar/navbar.html");
            $(".sidebar__icon__dashboard,  .sidebar__text__dashboard").removeClass("active");
            $(".sidebar__icon__asset,.sidebar__text__asset").addClass("active"); 
            $(".sidebar__icon__employee,.sidebar__text__employee").removeClass("active"); 
            $(".sidebar__icon__request,.sidebar__text__request").removeClass("active");
    });

  $(document).on('click', '.table-content-asset-admin-view', function(e) {
    var assetId=e.target.closest('.table-content-asset-admin-view').dataset.value;
    $.ajax({
        type: 'GET',
        url: path+'/api/assets/'+assetId,
        contentType: 'application/octet-stream',
        dataType: 'json',
        success: function(data){
            if(data.code == statusSuccess){
                localStorage.setItem('sku', assetId);
                window.location.href='../../views/asset/asset_detail.html';
            } else {     
                alert("error");
            }
        },
        error: function(data){
            alert("failed load data");
        }
    });
  });

  $(document).on('click', '.table-content-asset-admin-edit', function(e) {
        var assetId=e.target.closest('.table-content-asset-admin-edit').dataset.value;  
        localStorage.setItem('sku', assetId);
        window.location.href='../../views/asset/asset_edit.html';
  });
    
  var activePageNum=1;
  var maxRows=10;
  var countTotalPage=1;

   loadAssetList();

   function listData(data){
        $("#total-asset-text").text(data.paging.totalRecords);
        for(var index=0;index<data.value.assetList.length;index++){
            if(index>0 && index%10==0){
                countTotalPage++;
            }
            var markup = 
            `
            <div class="table-content-asset-admin-list table-content-asset-admin-page-${countTotalPage}">
            <input type="checkbox" class="table-content-asset-admin-checkbox" name="asset-checkbox-delete" value="${data.value.assetList[index].assetId}">              
            <div class="table-content table-content-asset-admin-name">${data.value.assetList[index].assetName}</div>
            <div class="table-content table-content-asset-admin-brand">${data.value.assetList[index].assetBrand}</div>
            <div class="table-content table-content-asset-admin-type">${data.value.assetList[index].assetType}</div>
            <div class="table-content table-content-asset-admin-location">${data.value.assetList[index].assetLocation}</div>
            <div class="table-content table-content-asset-admin-qty">${data.value.assetList[index].assetQty} pcs</div>                                       
            <div class="table-content table-content-asset-admin-icon table-content-asset-admin-view" data-value=${data.value.assetList[index].assetId}>
                    <a href="#" class="action-button-blue">    
                        <svg class="action-icon action-icon-blue">
                            <use xlink:href="../../assets/img/sprite.svg#icon-binoculars"></use>
                        </svg>
                    </a>
            </div>
            <div class="table-content table-content-asset-icon table-content-asset-admin-edit" data-value=${data.value.assetList[index].assetId}>
                    <a href="#" id="action-button-blue">    
                        <svg class="action-icon action-icon-blue">
                            <use xlink:href="../../assets/img/sprite.svg#icon-pencil"></use>
                        </svg>
                    </a>
            </div>
            </div> 
            </div> 
            `
            document.querySelector(".table-content-asset-admin").insertAdjacentHTML('beforeend',markup);
        }

        $('.table-content-asset-admin-list').hide();
       
        for(index=1;index<=countTotalPage;index++){
            if(index===activePageNum){
                $(".table-content-asset-admin-page-"+index).show();
            }else{
                $(".table-content-asset-admin-page-"+index).hide();
            }
        }

        printPagination(data);
    }

    function loadAssetList(){
        const url = window.location.href;
        const index = url.indexOf("search__asset");
        if(index === -1){
            $.ajax({
                type: 'GET',
                url: path+'/api/assets?pageNumber='+activePageNum+'&sortInfo=AassetName',
                contentType: 'application/octet-stream',
                dataType: 'json',
                success: function(data){
                    if(data.code == statusSuccess){
                        window.location.href='../../views/asset/asset_delete.html';
                        listData(data);
                    } else {     
                        console.log("error");
                    }
                },
                error: function(data){
                    alert("failed load data");
                }
            });
        }
        else{
            let keyword = url.substr(index+14,url.length-1); 
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8085/oasis/api/assets/find?searchQuery='+keyword+'&pageNumber=1&sortInfo=AassetName',
                contentType: 'application/octet-stream',
                dataType: 'json',
                success: function(data){
                    if(data.code === statusSuccess){
                        window.location.href='../../views/asset/asset_delete.html';
                       listData(data);
                    } else {     
                        console.log("error");
                    }
                },
                error: function(data){
                    console.log("failed at search");
                }
            });
        }
        
    }

    function printPagination(data){
        var totalRows=data.paging.totalRecords;
        if (totalRows > maxRows){
        var pagenum = Math.ceil(totalRows/maxRows);
            for (var i = 1; i <= pagenum;){			
                $('.pagination #next').before('<li data-page="'+i+'">\
                    <span>'+ i++ +'<span class="sr-only">(current)</span></span>\
                    </li>').show();
            }					
        }else{
            $(".pagination").hide();
        }

        $('.pagination [data-page="1"]').addClass('pagination__active'); 
    }
   
    $(document).on('click', '.pagination li', function(e) {
        var currPageNum = $(this).attr('data-page');
        
        if(currPageNum == "prev" ){
            if(activePageNum == 1 ){return;}
            currPageNum  = activePageNum-1; 
        }else if(currPageNum == "next" ){
            if(activePageNum == ($('.pagination li').length-2) ){return;}
            currPageNum  = activePageNum+1; 
        }

        $('.table-content-asset-admin-page-'+activePageNum).hide();
        activePageNum = currPageNum ;
        $('.pagination li').removeClass('pagination__active');
        $('.pagination [data-page="'+activePageNum+'"]').addClass('pagination__active');
        $('.table-content-asset-admin-page-'+activePageNum).show();
    });		
    
    $(".btn-asset-list-add").hide();

    $('.cancel__text').click(function(){
        window.location.href='../asset/asset.html'
    })   


    
   var countChecked=0;
   function checkAll() {
        countChecked=0;
        var inputs = document.querySelectorAll('.table-content-asset-admin-checkbox');
        for (var i = 0; i < inputs.length; i++) {
              inputs[i].checked = true; 
              countChecked++; 
        }
          
        this.onclick = uncheckAll;
        $(".checkbox__total-text").text(countChecked);
   }

   function uncheckAll() {
        var inputs = document.querySelectorAll('.table-content-asset-admin-checkbox');
        for (var i = 0; i < inputs.length; i++) {
              inputs[i].checked = false;
        }
    
        this.onclick = checkAll; 
        $(".checkbox__total-text").text(0);
        countChecked=0;
   }
          
    var el = document.querySelector(".asset__middle__checkbox-all"); 
    el.onclick = checkAll; 

    
    $(document).on('click', '.table-content-asset-admin-checkbox', function() {
        countChecked=$('.table-content-asset-admin-checkbox:checked').length;
        $(".checkbox__total-text").text(countChecked);
    });
        
    

    $('.btn-asset-list-delete').click(function(){
        var selectedIdArray=[];

        $(".table-content-asset-admin-checkbox:checked").each(function(){
            selectedIdArray.push($(this).val());
        });
        console.log(selectedIdArray);
        for(var i=0;i<selectedIdArray.length;i++){
            console.log(selectedIdArray[i]);
        } 
       
        var employeeNik=localStorage.getItem('id');
        var deleteData={
            employeeNik:employeeNik,
            selectedAssets:selectedIdArray
        }
        console.log(deleteData);

        $.ajax({
            type:'DELETE',
            url:'http://localhost:8085/oasis/api/assets/delete',
            data: JSON.stringify(deleteData),
            contentType:'application/json',
            dataType:'json',
            success:function(data){
                if(data.code===200){
                    alert("delete");
                    window.location.href='../../views/asset/asset.html';
                }else{
                    alert("error");
                }
            },
            error:function(data){
                console.log("failed at delete");
            }
        });
    });

});