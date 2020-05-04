"use strict";

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
    for (let i=0;i<resultTablePairs.length;i++){
        var cell = document.getElementById(tableId+"row"+i+"cell1"); //Value cell format id
        cell.innerHTML = (resultTablePairs[i].val) ? "Yes" : "No";
    }
}

function initializeTable(parentId,tableId,tableHeaderDesc,tablePairs){
    let myTable = document.createElement("TABLE");
    myTable.id = tableId;
    myTable.className +=" table";
    myTable.className +=" table-bordered";
    myTable.className +=" table-hover";
    myTable.className +=" table-responsive";
    myTable.className +=" custom-table";
    console.log("Table "+tableId+" with classes property "+myTable.className);
    document.getElementById(parentId).appendChild(myTable);
    initializeTableHeader(myTable,tableHeaderDesc);
    initializeTableBody(tableId, myTable,tablePairs);
}

function initializeTableHeader(table, tableHeaderDesc){
    let header = table.createTHead();
    let row = header.insertRow(0);
    for (let i = 0; i<tableHeaderDesc.length;i++){//Puts the elements of the header array on the table header
        let cell = row.insertCell(-1); 
        cell.innerHTML = "<strong>"+tableHeaderDesc[i]+"</strong>";
    }
}
function initializeTableBody(tableId, table, tablePairs){
        for (let i = 0 ; i< tablePairs.length ; i++){
            let row = table.insertRow(-1); //Inserted in the last row index
            row.id = tableId+"row"+i;
    
            let cellDesc = row.insertCell(0);
            cellDesc.id = row.id+"cell0";
            cellDesc.innerHTML = tablePairs[i].desc;
    
            let cellVal = row.insertCell(1);
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
    let table = document.getElementById(tableId);
    table.parentNode.removeChild(table);
}

function updateHistoryTable(password,passStrength){
    updatePastPasswords(password,passStrength);
    if (initializedHistoryTable){
        updateHistoryTableAux();
    }
}

function updateHistoryTableAux(){
    for (let i=0;i<pastPasswords.length;i++){
        let cellPass = document.getElementById(historyTableId+"row"+i+"cell0"); //Password cell format id
        cellPass.innerHTML = pastPasswords[i].desc;

        let cellStrength = document.getElementById(historyTableId+"row"+i+"cell1"); //Strength cell format id
        cellStrength.innerHTML = pastPasswords[i].val;
    }
}