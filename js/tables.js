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
		updateIconCell(cell, resultTablePairs[i].val);
	}
}

function updateIconCell(cell, propertyValue) {
	let icon = document.createElement("I");
	icon.setAttribute("aria-hidden", true);
	if (propertyValue) {
		icon.className = " fa fa-check";
	} else {
		icon.className = " fa fa-times";
	}
	cell.replaceChild(icon, cell.firstElementChild); //Removes the old child and
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
		let strongElem = document.createElement("STRONG");
		let textElem = document.createTextNode("" + tableHeaderDesc[i]);
		strongElem.appendChild(textElem);
		cell.appendChild(strongElem);
	}
}
function initializeTableBody(tableId, table, tablePairs) {
	for (let i = 0; i < tablePairs.length; i++) {
		let row = table.insertRow(-1); //Inserted in the last row index
		row.id = tableId + "row" + i;

		let cellDesc = row.insertCell(0);
		cellDesc.id = row.id + "cell0";
		let descPara = document.createElement("P");
		let descText = document.createTextNode(tablePairs[i].desc);
		descPara.appendChild(descText);
		cellDesc.appendChild(descPara);

		let cellVal = row.insertCell(1);
		cellVal.id = row.id + "cell1";
		let valPara = document.createElement("P");
		let valText = document.createTextNode(tablePairs[i].val);
		valPara.appendChild(valText);
		cellVal.appendChild(valPara);
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
		updateCell(cellPass, pastPasswords[i].desc);
		let cellStrength = document.getElementById(
			historyTableId + "row" + i + "cell1"
		); //Strength cell id format
		updateCell(cellStrength, pastPasswords[i].val);
	}
}

function updateCell(cell, text) {
	let para = document.createElement("P");
	let textNode = document.createTextNode(text);
	para.appendChild(textNode);
	cell.replaceChild(para, cell.firstElementChild);
}
