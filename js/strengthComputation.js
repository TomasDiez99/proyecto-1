"use strict";


//Global variables
const minLength = 5;


function computeStrength(passwordValues){
    let strength = 0;
    let i = 0;
    while (i<passwordValues.length){
        if (passwordValues[i]){
            strength++;
        }
        i++;
    }
    strength = (strength / passwordValues.length).toFixed(2); //round number;
    return strength*100;
}
function showStrength(passStrength){
    document.getElementById("result-test").innerHTML = passStrength;
}

function hasMinLength(password){
    if (password.length >= minLength){
        return true;
    }
    else{
        return false;
    }
}

function hasSymbols(password){
    var regExpr =/[$-/:-?{-~!"^_`\[\]]/; //Not a english letter or a digit (\S) or a white space Regular expression
    if (regExpr.test(password)){
        return true;
    }
    else{
        return false;
    }
}

function hasNumber(password){
    var regExpr = /\d/ ; //Any digit from 0 to 9 Regular expression
    if (regExpr.test(password)){
        return true;
    }
    else{
        return false;
    }
}

function hasLetter(password){
    var regExpr = /[A-Za-z]/; //Any letter from A to Z or from a to z Regular expression
    if (regExpr.test(password)){
        return true;
    }
    else{
        return false;
    }
}

function hasUpperCase(password){
    var lowerCasePassword = password.toLowerCase();
    var res = password.localeCompare(lowerCasePassword);
    if (res == 0){/*the strings were equals, this mean the password dont have uppercase letters */
        return false;
    }
    else{
        return true;
    }
}
function hasLowerCase(password){
    var upperCasePassword = password.toUpperCase();
    var res = password.localeCompare(upperCasePassword);
    if (res == 0){/*the strings were equals, this mean the password dont have lowercase letters */
        return false;
    }
    else{
        return true;
    }
}