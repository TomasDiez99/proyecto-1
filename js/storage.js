"use strict";

//STORAGE RELATED FUNCTIONS

//This function deletes the first pastPassword if the array exceeds the maximun count and puts element at the start of the array
function updatePastPasswords(password, passStrength) {
	if (maxPastPasswordsCount != pastPasswords.length) {
		//this means the maxPastPasswordsCount changed by programmer. A mockup array replaces the history
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
	//Generates mockup array if it is the first time the user operates with the page or the programmer changed the maxPastPasswordCount
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

function loadGuideAlert() {
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
	}
}

function loadMode() {
	let mode = window.localStorage.getItem(darkSwitchId);
	setDarkModeAssets(mode != null);
}

function setDarkModeAssets(enableDarkMode) {
	if (enableDarkMode) {
		document.getElementById(logoContainerId).src = secondaryLogoPath;
		document.getElementById(pageIconId).href = secondaryPageIconPath;
	} else {
		document.getElementById(logoContainerId).src = logoPath;
		document.getElementById(pageIconId).href = pageIconPath;
	}
}

function updateMode() {
	let mode = window.localStorage.getItem(darkSwitchId);

	if (/Edge/.test(navigator.userAgent)) {
		//Fix for Edge Browser bug where the assets were set with the opposite mode
		setDarkModeAssets(mode != null);
		return;
	}

	setDarkModeAssets(mode == null);
}
