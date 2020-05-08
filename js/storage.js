"use strict";

//STORAGE RELATED FUNCTIONS

//This function deletes the first pastPassword if the array exceeds the maximun count and puts element at the start of the array
function updatePastPasswords(password, passStrength) {
	if (maxPastPasswordsCount != pastPasswords.length) {
		//this means the maxPastPasswordsCount changed by programmer. A mock array replaces the history
		for (let i = pastPasswords.length; i < maxPastPasswordsCount; i++) {
			pastPasswords.push(new PairDescValue("-", "-"));
		}
	}

	var newPastPasswordPair = new PairDescValue(password, passStrength);
	if (pastPasswords.length >= maxPastPasswordsCount) {
		pastPasswords.shift(); //deletes the first element of the array
	}
	pastPasswords.push(newPastPasswordPair);
	window.localStorage.setItem(passwordsKey, JSON.stringify(pastPasswords)); //Stores (and possibly replaces) the pastPassword array in the browser
}

function loadPastPasswords() {
	if (typeof window.localStorage === "undefined") {
		//Local storage not found
		createAlert(
			"ERROR",
			"BROWSER LOCAL STORAGE SYSTEM NOT FOUND",
			"CHANGES MAY NOT BE SAVED",
			"danger",
			true,
			false,
			alertZoneId,
			false
		);
	} else {
		var pastPasswordsCode = window.localStorage.getItem(passwordsKey);
	}
	pastPasswords = JSON.parse(pastPasswordsCode);
	//Generates mock array if it is the first time the user operates with the page or the programmer changed the maxPastPasswordCount
	if (pastPasswords == null || maxPastPasswordsCount != pastPasswords.length) {
		pastPasswords = [];
		for (let i = pastPasswords.length; i < maxPastPasswordsCount; i++) {
			pastPasswords.push(new PairDescValue("-", "-"));
		}
		window.localStorage.setItem(passwordsKey, JSON.stringify(pastPasswords));
	} else {
		for (
			let i = 0;
			i < pastPasswords.length;
			i++ // Transform raw json to PairDescValue object (to use getters)
		) {
			pastPasswords[i] = new PairDescValue(
				pastPasswords[i]._desc,
				pastPasswords[i]._val
			);
		}
	}
}

function updateGuideAlert() {
	let makeGuideAlertCode = window.localStorage.getItem(guideAlertKey);
	makeGuideAlert = Boolean(JSON.parse(makeGuideAlertCode)); //Transform null to false in parse failure case
	if (makeGuideAlert) {
		//this means is the first time in page
		createAlert(
			"Hey!",
			"Need some help?",
			"- Press Help button to view tips",
			"primary",
			true,
			false,
			guideZoneId,
			false
		);
	}
}
function clearStorage() {
	if (confirm("Are you sure you want to delete the history?")) {
		window.localStorage.clear();
		loadPastPasswords();
		makeGuideAlert = true; //Reset the flag to make guide alert when reload
		window.localStorage.setItem(guideAlertKey, JSON.stringify(makeGuideAlert));
		console.log("Storage Cleared");
	}
}

function loadMode() {
	let mode = window.localStorage.getItem("darkSwitch");
	if (mode == null) {
		//This means we are in light mode
		console.log("NO DARK MODE");
		console.log("el mode loaded es " + mode);
		document.getElementById("logo-container").src = "assets/logo.png";
	} else {
		console.log("DARK MODE");
		console.log("el mode loaded es " + mode);
		document.getElementById("logo-container").src = "assets/secondaryLogo.png";
	}
}

function updateMode() {
	let mode = window.localStorage.getItem("darkSwitch");
	if (mode == null) {
		//This means we changed to dark mode
		console.log("DARK MODE");
		console.log("el mode es " + mode);
		document.getElementById("logo-container").src = "assets/secondaryLogo.png";
		document.getElementById("page-icon").href = "assets/secondaryPageIcon.png";
	} else {
		console.log("NO DARK MODE");
		console.log("el mode es " + mode);
		document.getElementById("logo-container").src = "assets/logo.png";
		document.getElementById("page-icon").href = "assets/pageIcon.png";
	}
}
