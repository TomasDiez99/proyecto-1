//Global Variables
var minLength = 6;
var passwordField = "password-field";
var testButton = "test-button";
var passwordProperties = [
    hasMinLength,
    hasNumber,
    hasLetter,
    hasSymbols,
    hasUpperCase,
    hasLowerCase
]

var initializedResultTable = false;
var resultTableId = "result-table";
var resultTableHeaderDesc = "Propierties of your password";
var resultTableBodyDesc = ["Min Length","Has Numbers","Has Letters","Has Symbols","Upper Case","Lower Case"];
var resultTableParentId ="result-table-col";


var initializedHistoryTable = false;
var maxPastPasswordsCount = 5;
var historyTableId = "history-table";
var historyTableHeaderDesc = "Last "+maxPastPasswordsCount+" passwords";
var historyTableParentId ="history-table-col";
var pastPasswords = [];

class PairDescValue{
    constructor(desc,val){
        this._desc = desc;
        this._val = val;
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


function testPassword(){
    var password = document.getElementById(passwordField).value;
    if (0==password.localeCompare("")){
        createAlert("Opps!","Try again","Looks like you didn't insert a password",'warning',true,true,"alert-zone");
    }else{
        document.getElementById(passwordField).value = ""; //Clears the input field
        var passwordResults = [];
        //This calls on every passwordProperties function and stores its result on passwordValues
        for (i = 0; i<passwordProperties.length;i++){
            passwordResults.push(passwordProperties[i].apply(null,[password]));
        }     
        var passStrength = computeStrength(passwordResults);
        showStrength(passStrength);

        var resultTablePairs = buildPairs(resultTableBodyDesc, passwordResults, passwordResults.length);
        updateTables(password, resultTablePairs, passStrength);
    }

    
}

//Builds an array of Pairs with size beeing size parameter
function buildPairs(descs, vals, size){
    var pairs = [];
    for (i = 0; i<size;i++){
        pairs.push(new PairDescValue(descs[i],vals[i]));
    }
    return pairs;
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Tables Initialization and update
function updateTables(password, resultTablePairs, passStrength){
    updateResultTable(resultTablePairs);
    updateHistoryTable(password,passStrength);
}

function updateResultTable(resultTablePairs){
    if (!initializedResultTable){
        initializedResultTable = true;
        initializeTable(resultTableParentId,resultTableId,resultTableHeaderDesc,resultTablePairs);
    }
    updateResultTableAux(resultTableId, resultTablePairs);
}

function updateResultTableAux(tableId,resultTablePairs){
    for (i=0;i<resultTablePairs.length;i++){
        var cell = document.getElementById(tableId+"row"+i+"cell1"); //Value cell format id
        cell.innerHTML = (resultTablePairs[i].val) ? "Yes" : "No";
    }
}

function initializeTable(parentId,tableId,tableHeaderDesc,tablePairs){
    //Creating table
    var myTable = document.createElement("TABLE");
    myTable.id = tableId;
    myTable.className +=" table";
    myTable.className +=" table-bordered";
    myTable.className +=" table-hover";
    myTable.className +=" table-responsive";
    myTable.className +=" custom-table";
    document.getElementById(parentId).appendChild(myTable);

    //Creating header
    var header = myTable.createTHead();
    var row = header.insertRow(0);
    var cell = row.insertCell(0);
    cell.innerHTML = "<strong>"+tableHeaderDesc+"</strong>";

    //Creating body
    for (i = 0 ; i< tablePairs.length ; i++){
        var row = myTable.insertRow(-1); //Inserted in the last row index
        row.id = tableId+"row"+i;

        var cellDesc = row.insertCell(0);
        cellDesc.id = row.id+"cell0";
        cellDesc.innerHTML = tablePairs[i].desc;

        var cellVal = row.insertCell(1);
        cellVal.innerHTML = tablePairs[i].val;
        cellVal.id = row.id+"cell1";
    }
}

//This is called for the first time per reload when the user clicks the "History button"
function toggleHistoryTable(){
    if (!initializedHistoryTable){
        initializeTable(historyTableParentId,historyTableId,historyTableHeaderDesc,pastPasswords);

    }
    else{
        deleteTable(historyTableId);
    }
    initializedHistoryTable = !initializedHistoryTable;
}

function deleteTable(tableId){
    var table = document.getElementById(tableId);
    table.parentNode.removeChild(table);
}

function updateHistoryTable(password,passStrength){
    updatePastPasswords(password,passStrength);
    if (initializedHistoryTable){
        updateHistoryTableAux();
    }
}

function updateHistoryTableAux(){
    for (i=0;i<pastPasswords.length;i++){
        var cellPass = document.getElementById(historyTableId+"row"+i+"cell0"); //Password cell format id
        cellPass.innerHTML = pastPasswords[i].desc;
        var cellStrength = document.getElementById(historyTableId+"row"+i+"cell1"); //Strength cell format id
        cellStrength.innerHTML = pastPasswords[i].val;
    }
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Password properties computation
function computeStrength(passwordValues){
    var strength = 0;
    var i = 0;
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

    pastPasswords = window.localStorage.getItem(JSON.stringify(pastPasswords)); //Get the last pastPasswords array stored in browser
    if(pastPasswords == null){ //This means is the first time the user operates with the page
        var mockpass = ["PASS1","PASS2","PASS3","PASS4","PASS5"];
        var pastPasswordsStrengths = ["N1","N2","N3","N4","N5"];
        pastPasswords = buildPairs(mockpass,pastPasswordsStrengths,maxPastPasswordsCount);
        window.localStorage.setItem(JSON.stringify(pastPasswords),pastPasswords); //Stores the mock array if its the first time
        console.log("Mock array created");
    }


    console.log("Loaded page");
}
//Enter key handler for testPassword
document.getElementById(passwordField).addEventListener("keyup", event => {
    if(event.key !== "Enter") return;
    document.getElementById(testButton).click();
    event.preventDefault();
});

//reutilized code from https://codepen.io/codysechelski/pen/dYVwjb
function createAlert(title, summary, details, severity, dismissible, autoDismiss, appendToId) {
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
        },1000);
      }, 5000);
    }
  }
  


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Storage management functions

//This function deletes the first pastPassword if the array exceeds the maximun count and puts element at the start of the array
function updatePastPasswords(password,passStrength){
    window.localStorage.removeItem(JSON.stringify(pastPasswords)); //Deletes the stored array entry because we want to update it
    var newPastPasswordPair = new PairDescValue(password,passStrength);
    console.log("desc nuevo "+newPastPasswordPair.desc,"value nuevo "+newPastPasswordPair.val);
    if (pastPasswords.length > maxPastPasswordsCount){
        console.log("checkpoint overflow pastpasswords");
        var deletedPair = pastPasswords.shift(); //deletes the first element of the array
    }
    pastPasswords.push(newPastPasswordPair);
    window.localStorage.setItem(JSON.stringify(pastPasswords),pastPasswords); //Stores the pastPassword array in the browser
}
























