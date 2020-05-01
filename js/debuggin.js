"use strict";

//DEBUGGING PURPOSE FUNCTIONS



//SHOW PAST PASSWORDS FROM BROWSER LOCALSTORAGE
document.addEventListener("keyup", eventt => {
    if(eventt.key !== "ArrowDown") return;
    printPastPasswords();
    eventt.preventDefault();
});
function printPastPasswords(){
    console.log("LOCALSTORAGE");
    var toPrintCode = window.localStorage.getItem(passwordsKey);
    var toPrint = JSON.parse(toPrintCode);
    if (toPrint==null){
        console.log("LOCALSTORAGE RETURNED NULL")
    }else{
        for (let i = 0; i<toPrint.length;i++){
            console.log(i+") Desc "+toPrint[i]._desc+", Val "+toPrint[i]._val);
        }
    }
}

//SHOW PAST PASSWORDS FROM GLOBAL VARIABLE
document.addEventListener("keyup", eventt => {
    if(eventt.key !== "ArrowUp") return;
    printPastPasswordsAux();
    eventt.preventDefault();
});
function printPastPasswordsAux(){
    console.log("VARIABLE");
    for (let i = 0; i<pastPasswords.length;i++){
        console.log(i+" Desc "+pastPasswords[i].desc+"Val "+pastPasswords[i].val);
    }
}
