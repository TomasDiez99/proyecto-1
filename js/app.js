//Global Variables
var minLength = 6;
var passwordField = "password-field";
//Onload page
window.onload = function() {
    onloadPage();
};
function onloadPage(){
    console.log("Loaded page");
}

//Enter key handler for testPassword
document.getElementById(passwordField).addEventListener('keyup', testPasswordHandler);

function testPasswordHandler(){
    print("Enter apretado")
    if (testPasswordHandler.code === "Enter") 
        testPassword();
  }

  

function testPassword(){
    var password = document.getElementById(passwordField).value;
    var passwordProperties = [hasMinLength(password),
                            hasNumber(password),
                            hasLetter(password),
                            hasSymbols(password),
                            hasUpperCase(password),
                           hasLowerCase(password)];

    var passStrength = computeStrength(passwordProperties);
    showStrength(passStrength);
}

function computeStrength(passwordProperties){
    var strength = 0;
    var i = 0;
    while (i<passwordProperties.length){
        if (passwordProperties[i]){
            strength++;
        }
        i++;
    }
    strength = (strength / passwordProperties.length).toFixed(2); //round number;
    return strength*100;
}
function showStrength(passStrength){
    document.getElementById("result-test").innerHTML = passStrength;
}













function hasMinLength(password){
    if (password.length > minLength){
        return true;
    }
    else{
        return false;
    }
}

function hasSymbols(password){
    var regExpr = /[\W\S]/; //Not a english letter or a digit (\S) or a white space Regular expression
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