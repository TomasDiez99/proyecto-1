"use strict"; //For cleaner code

//MUST BE IMPORTED BEFORE STORAGE.JS IN HTML IMPORTS

//Global Variables and classes
const passwordField = "password-field";
const testButton = "test-button";
var passwordProperties = []; 
const alertZoneId = "alert-zone";
const guideZoneId = "guide-zone";
var makeGuideAlert = false;
var usingAlertSpace = false;

var initializedResultTable = false;
const resultTableId = "result-table";
const resultTableHeaderDesc = ["Propierties of your password"];
const resultTableBodyDesc = ["Min Length","Has Numbers","Has Letters","Has Symbols","Upper Case","Lower Case"];
const resultTableParentId ="result-table-col";


var initializedHistoryTable = false;
const maxPastPasswordsCount = 5;
const historyTableId = "history-table";
const historyTableHeaderDesc = ["Last "+maxPastPasswordsCount+" password(s)", "Strength"];
const historyTableParentId ="history-table-col";
var pastPasswords = [];


const passwordsKey = "passwordsKey";
const modeKey = "modeKey";
const guideAlertKey = "guideAlertKey";

/**
 * Pair class that stores two attributes for flexible usage
 */
class PairDescValue {

    constructor(desc,val){
        this._desc = desc;
        this._val = val;
    }
    toJson(){
        return {
            _desc : this._desc,
            _val : this._val,
            desc : this.desc,
            val : this.val,
        }
    }
    get desc(){
        return this._desc;
    }
    get val(){
        return this._val;
    }
    set desc(desc){
        this._desc = desc;
    }
    set val(val){
        this._val = val;
    }
}

//Builds an array of Pairs with size beeing size parameter
function buildPairs(descs, vals, size){
    let pairs = [];
    for (let i = 0; i<size;i++){
        pairs.push(new PairDescValue(descs[i],vals[i]));
    }
    return pairs;
}


function testPassword(){
    var password = document.getElementById(passwordField).value;
    if (0==password.localeCompare("")){
        if (!usingAlertSpace){
            usingAlertSpace = true;
            createAlert("Oops!","Try again","Looks like you didn't insert a password",'warning',true,true,alertZoneId, usingAlertSpace);
        }
    }else{
        document.getElementById(passwordField).value = ""; //Clears the input field
        var passwordResults = [];
        //This calls on every passwordProperties function and stores its result on passwordValues
        for (let i = 0; i<passwordProperties.length;i++){
            passwordResults.push(passwordProperties[i].apply(null,[password]));
        }     
        var passStrength = computeStrength(passwordResults);
        showStrength(passStrength);

        var resultTablePairs = buildPairs(resultTableBodyDesc, passwordResults, passwordResults.length);
        updateTables(password, resultTablePairs, passStrength);
    }

    
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//User interface related functions

//Onload page
window.onload = function() {
    onloadPage();
};
function onloadPage(){
    initializedResultTable = false;
    initializedHistoryTable = false;
    usingAlertSpace = false;
    updateGuideAlert();


    passwordProperties = [
        hasMinLength,
        hasNumber,
        hasLetter,
        hasSymbols,
        hasUpperCase,
        hasLowerCase
    ];
    loadPastPasswords();

    console.log("Loaded page");
}
//Enter key handler for testPassword
document.getElementById(passwordField).addEventListener("keyup", event => {
    if(event.key !== "Enter") return;
    document.getElementById(testButton).click();
    event.preventDefault();
});

//History table key handler
document.addEventListener("keyup", event => {
    if(event.key !== "h") return; //H letter keyCode
    toggleHistoryTable();
    event.preventDefault();
});



//reutilized code from https://codepen.io/codysechelski/pen/dYVwjb
function createAlert(title, summary, details, severity, dismissible, autoDismiss, appendToId, alertSpace) {
    var iconMap = {
      info: "fa fa-info-circle",
      success: "fa fa-thumbs-up",
      warning: "fa fa-exclamation-triangle",
      danger: "fa ffa fa-exclamation-circle"
    };
  
    var iconAdded = false;
  
    var alertClasses = ["alert", "animated", "flipInX"];
    alertClasses.push("alert-" + severity.toLowerCase());
  
    if (dismissible) {
      alertClasses.push("alert-dismissible");
    }
  
    var msgIcon = $("<i />", {
      "class": iconMap[severity] // you need to quote "class" since it's a reserved keyword
    });
  
    var msg = $("<div />", {
      "class": alertClasses.join(" ") // you need to quote "class" since it's a reserved keyword
    });
  
    if (title) {
      var msgTitle = $("<h4 />", {
        html: title
      }).appendTo(msg);
      
      if(!iconAdded){
        msgTitle.prepend(msgIcon);
        iconAdded = true;
      }
    }
  
    if (summary) {
      var msgSummary = $("<strong />", {
        html: summary
      }).appendTo(msg);
      
      if(!iconAdded){
        msgSummary.prepend(msgIcon);
        iconAdded = true;
      }
    }
  
    if (details) {
      var msgDetails = $("<p />", {
        html: details
      }).appendTo(msg);
      
      if(!iconAdded){
        msgDetails.prepend(msgIcon);
        iconAdded = true;
      }
    }
    
  
    if (dismissible) {
      var msgClose = $("<span />", {
        "class": "close", // you need to quote "class" since it's a reserved keyword
        "data-dismiss": "alert",
        html: "<i class='fa fa-times-circle'></i>"
      }).appendTo(msg);
    }
    
    $('#' + appendToId).prepend(msg);
    
    if(autoDismiss){
      setTimeout(function(){
        msg.addClass("flipOutX");
        setTimeout(function(){
          msg.remove();
          if (alertSpace) { usingAlertSpace = false;} //Inserted code to manage alert zone behaviour
        },1000);
      }, 5000);
      
    }
  }

  function openContactLink(){
    window.open('https://github.com/TomasDiez99', 'Contact', 'width=800,height=800');
  }






/*

  $(guideZoneId).children.on('closed.bs.alert', function () {
    console.log("DISSMISS CLICKED");
  })

  */