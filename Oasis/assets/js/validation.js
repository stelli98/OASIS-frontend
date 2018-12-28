
export function isAlphabetNumeric(input){
    var regexAlphabetNumeric="[A-Za-z0-9]+(( )?(.+)?[A-Za-z0-9]+)*";
    if(!input.match(regexAlphabetNumeric)){
        return "Can be alphanumeric";
    }
}

export function isAlphabet(input){
    var regexAlphabet="[A-Za-z]+";
    if(!input.match(regexAlphabet)){
        return "Must be alphabet";
    }
}


export function isNumber(input){
    var regexNumber="[1-9][0-9]*";
    if(!input.match(regexNumber)){
        return "Must be valid positive number";
    }
}

export function isNominal(input){
    var regexNominal="[1-9]([0-9]){2,}(\.([0-9]){2})?";
    if(!input.match(regexNominal)){
        return "Must in IDR currency without any symbol";
    }
}

export function isPhoneNumber(input){
    var regexNominal="^(\\+62|0){1}([0-9]){10,12}";
    if(!input.match(regexNominal)){
        return "Must start with +62 or 0";
    }
}

export function isImageExtension(input){
    var regexImageExtensionJpeg="^.+\\.[jJ][pP][eE][gG]$";
    var regexImageExtensionPng="^.+\\.[pP][nN][gG]$";
    if(!input.match(regexImageExtensionJpeg) && !input.match(regexImageExtensionPng)){
        return "Image type must be .jpg or .png";
    }
}

export function isSelectedSupervisor(input){
    if(input.includes("-select supervisor-")>0){
        return "Must select a supervisor";
    }
}

