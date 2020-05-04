"use strict";

//STORAGE RELATED FUNCTIONS

//This function deletes the first pastPassword if the array exceeds the maximun count and puts element at the start of the array
function updatePastPasswords(password,passStrength){
    if (maxPastPasswordsCount!=pastPasswords.length){ //this means the maxPastPasswordsCount changed and the array must be updated to that length
        for (let i = pastPasswords.length;i<maxPastPasswordsCount;i++){
            pastPasswords.push(new PairDescValue("-","-"));
        }
    }

    var newPastPasswordPair = new PairDescValue(password,passStrength);
    if (pastPasswords.length >= maxPastPasswordsCount){
        pastPasswords.shift(); //deletes the first element of the array
    }
    pastPasswords.push(newPastPasswordPair);
    window.localStorage.setItem(passwordsKey, JSON.stringify(pastPasswords)); //Stores (and possibly replaces) the pastPassword array in the browser
}

function loadPastPasswords(){
    if (typeof window.localStorage === 'undefined'){//Local storage not found
        createAlert("ERROR","BROWSER LOCAL STORAGE NOT FOUND","CHANGES MAY NOT BE SAVED","danger",true,false,alertZoneId,false);
    }else{
        var pastPasswordsCode = window.localStorage.getItem(passwordsKey); //Get the last pastPasswords array stored in browser
    }
    pastPasswords = JSON.parse(pastPasswordsCode); //Parse the string to get the actual pastPasswords array
    
    //This means is the first time the user operates with the page or the programmer changed the maxPastPasswordCount
    if(pastPasswords == null || maxPastPasswordsCount!=pastPasswords.length){
        let mockPass = [];
        let mockPastPasswordsStrengths = [];
        for (let i = 0; i<maxPastPasswordsCount;i++){
            mockPass.push("-");
            mockPastPasswordsStrengths.push("-");
        }
        pastPasswords = buildPairs(mockPass,mockPastPasswordsStrengths,maxPastPasswordsCount);
        window.localStorage.setItem(passwordsKey,JSON.stringify(pastPasswords)); //Stores the mock array if its the first time
    }
    else{        
        for (let i = 0; i < pastPasswords.length; i++) // Transform raw json to PairDescValue object (to use getters)
        {
            pastPasswords[i] = new PairDescValue(pastPasswords[i]._desc,pastPasswords[i]._val);
        }
    }
}

function updateGuideAlert(){
    let makeGuideAlertCode = window.localStorage.getItem(guideAlertKey);
    makeGuideAlert = Boolean(JSON.parse(makeGuideAlertCode)); //Transform null to false in parse failure case
    if (makeGuideAlert){ //this means is the first time in page
        createAlert("Hey!","Here, take some tips",
        "- Press H toggle on and off history table","primary",true,false,guideZoneId,false);
    }

}
function clearStorage(){
    if (confirm("Are you sure you want to delete the history?")){
        window.localStorage.clear();
        loadPastPasswords();
        makeGuideAlert = true; //Reset the flag to make guide alert when reload
        window.localStorage.setItem(guideAlertKey,JSON.stringify(makeGuideAlert));
        console.log("Storage Cleared");
    }
    
}


function loadMode(){
    let mode = window.localStorage.getItem("darkSwitch");
    if (mode==null){ //This means we are in light mode
        console.log("NO DARK MODE");
        document.getElementById("logo-container").src = "assets/logo.png";
    }
    else{
        console.log("DARK MODE");
        document.getElementById("logo-container").src = "assets/secondaryLogo.png";
    }
}

function updateMode(){
    let mode = window.localStorage.getItem("darkSwitch");
    if (mode==null){ //This means we changed to dark mode
        console.log("DARK MODE");
        document.getElementById("logo-container").src = "assets/secondaryLogo.png";
        document.getElementById("page-icon").href = "assets/secondaryPageIcon.png"; 
    }
    else{
        console.log("NO DARK MODE");
        document.getElementById("logo-container").src = "assets/logo.png";
        document.getElementById("page-icon").href = "assets/pageIcon.png";
    }
}