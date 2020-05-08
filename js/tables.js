"use strict";

//Tables Initialization and update
function updateTables(password, resultTablePairs, passStrength) {
	updateResultTable(resultTablePairs);
	updateHistoryTable(password, passStrength);
}

function updateResultTable(resultTablePairs) {
	if (!initializedResultTable) {
		initializedResultTable = true;
		initializeTable(
			resultTableParentId,
			resultTableId,
			resultTableHeaderDesc,
			resultTablePairs
		);
	}
	updateResultTableAux(resultTableId, resultTablePairs);
}

function updateResultTableAux(tableId, resultTablePairs) {
	for (let i = 0; i < resultTablePairs.length; i++) {
		let cell = document.getElementById(tableId + "row" + i + "cell1"); //Value cell format id
		updateCell(cell, resultTablePairs[i].val);
	}
}

function updateCell(cell, propertyValue) {
	if (propertyValue) {
		cell.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
	} else {
		cell.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
	}
}

function initializeTable(parentId, tableId, tableHeaderDesc, tablePairs) {
	let myTable = document.createElement("TABLE");
	myTable.id = tableId;
	myTable.className += " table";
	myTable.className += " table-hover";
	myTable.className += " table-responsive";
	myTable.className += " custom-table";
	myTable.className += " text-center";
	document.getElementById(parentId).appendChild(myTable);
	initializeTableHeader(myTable, tableHeaderDesc);
	initializeTableBody(tableId, myTable, tablePairs);
}

function initializeTableHeader(table, tableHeaderDesc) {
	let header = table.createTHead();
	let row = header.insertRow(0);
	for (let i = 0; i < tableHeaderDesc.length; i++) {
		//Puts the elements of the header array on the table header
		let cell = row.insertCell(-1);
		cell.innerHTML = "<strong>" + tableHeaderDesc[i] + "</strong>";
	}
}
function initializeTableBody(tableId, table, tablePairs) {
	for (let i = 0; i < tablePairs.length; i++) {
		let row = table.insertRow(-1); //Inserted in the last row index
		row.id = tableId + "row" + i;

		let cellDesc = row.insertCell(0);
		cellDesc.id = row.id + "cell0";
		cellDesc.innerHTML = tablePairs[i].desc;

		let cellVal = row.insertCell(1);
		cellVal.innerHTML = tablePairs[i].val;
		cellVal.id = row.id + "cell1";
	}
}

//This is called for the first time per reload when the user clicks the "History button"
function toggleHistoryTable() {
	if (!initializedHistoryTable) {
		initializeTable(
			historyTableParentId,
			historyTableId,
			historyTableHeaderDesc,
			pastPasswords
		);
	} else {
		deleteTable(historyTableId);
	}
	initializedHistoryTable = !initializedHistoryTable;
}

function deleteTable(tableId) {
	let table = document.getElementById(tableId);
	table.parentNode.removeChild(table);
}

function updateHistoryTable(password, passStrength) {
	updatePastPasswords(password, passStrength);
	if (initializedHistoryTable) {
		updateHistoryTableAux();
	}
}

function updateHistoryTableAux() {
	for (let i = 0; i < pastPasswords.length; i++) {
		let cellPass = document.getElementById(
			historyTableId + "row" + i + "cell0"
		); //Password cell id format
		cellPass.innerHTML = pastPasswords[i].desc;

		let cellStrength = document.getElementById(
			historyTableId + "row" + i + "cell1"
		); //Strength cell id format
		cellStrength.innerHTML = pastPasswords[i].val;
	}
}
