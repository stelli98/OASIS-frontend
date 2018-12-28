export const statusSuccess=200;
export const path='http://localhost:8085/oasis';

export const elements={
    // btnNewRequestTab=$(".new-request__action__button"),
    // btnNewRequestReject
    btnAssetTableEdit:$(".table-content-asset-admin-edit"),
    btnAssetListAdd:$(".btn-asset-list-add"),
    btnAssetListDelete:$(".btn-asset-list-delete"),


}

export function dateFormatter(date){
    var dateTimeArray= date.split(" ");
    var newDateFormat=dateTimeArray[0]+","+dateTimeArray[2]+" "+dateTimeArray[1]+" "+dateTimeArray[5]+"  "+dateTimeArray[3];
    return newDateFormat;
}

export function dobFormatter(date){
    var dobArray= date.split("-");
    var newDobFormat=dobArray[2]+"-"+dobArray[1]+"-"+dobArray[0];
    return newDobFormat;
}

export function textFormatter(str){
    return str.replace(/\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}