export function isDobEmpty(input) {
    if (input == '') {
        return "Can't be empty";
    } else {
        return "";
    }
}

export function isAlphabetNumeric(input) {
    if (input != '') {
        var regexAlphabetNumeric = "[A-Za-z0-9]+(( )?(.+)?[A-Za-z0-9]+)*";
        if (!input.match(regexAlphabetNumeric)) {
            return "Can be alphanumeric";
        } else {
            return "";
        }
    } else {
        return "Can't be empty";
    }
}

export function isAlphabet(input) {
    if (input != '') {
        var regexAlphabet = "^([A-Za-z]+ ?)*[A-Za-z]+$";
        if (!input.match(regexAlphabet)) {
            return "Must be alphabet";
        } else {
            return "";
        }
    } else {
        return "Can't be empty";
    }

}

export function isNumber(input) {
    if (isNaN(input) || input<=0) {
        return "Must be valid positive number above 0";
    }else{
        return "";
    }
}


export function isNominal(input) {
    if (isNaN(input) ||  input<=0) {
        return "Must in IDR currency without any symbol";
    }else{
        return "";
    }
}

export function isPhoneNumber(input) {
    if (input != '') {
        var regexPhoneNumber = "^(\\+62|0){1}([0-9]){10,12}$";
        if (!input.match(regexPhoneNumber)) {
            return "Must start with 0/+62 with 12-13 digits length";
        } 
        else {
            return "";
        }
    } else {
        return "Can't be empty";
    }

}

export function isImageExtension(input) {
    if (input != '') {
        var regexImageExtensionJpeg = "^.+\\.[jJ][pP][eE][gG]$";
        var regexImageExtensionJpg = "^.+\\.[jJ][pP][gG]$";
        var regexImageExtensionPng = "^.+\\.[pP][nN][gG]$";
        if (!input.match(regexImageExtensionJpeg) && !input.match(regexImageExtensionJpg) && !input.match(regexImageExtensionPng)) {
            return "Image type must be .jpg or .png";
        } else {
            return "";
        }
    } else {
        return "Can't be empty";
    }

}

export function isSelectedSupervisor(input) {
    if (input.indexOf("-select supervisor-") != -1) {
        return "Must select a supervisor";
    } else {
        return "";
    }
}

export function isSelectedDivision(input) {
    if (input.indexOf("-select division-") != -1) {
        return "Must select a division";
    } else {
        return "";
    }
}

// module.exports = {
//     isEmpty: function (input) {
//         if (input == '') {
//             return "Can't be empty";
//         } else {
//             return "";
//         }
//     },

//     isSelectedDivision: function (input) {
//         if (input.indexOf("-select division-") != -1) {
//             return "Must select a division";
//         } else {
//             return "";
//         }
//     },

//     isSelectedSupervisor: function (input) {
//         if (input.indexOf("-select supervisor-") != -1) {
//             return "Must select a supervisor";
//         } else {
//             return "";
//         }
//     },

//     isNumber: function (input) {
//         if (input <= 0) {
//             return "Must be valid positive number above 0";
//         } else {
//             return "";
//         }
//     },

//     // isAlphabet: function (input) {
//     //     for(var index=0;input.length;index++){
//     //         if( !(input[index]>='a' && input[index]<='z') || !(input[index]>='A' && input[index]<='Z')){
//     //             return "Must be alphabet";
//     //         }else{
//     //             return "";
//     //         }
//     //     }
//     // },

// }