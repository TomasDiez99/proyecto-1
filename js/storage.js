"use strict";

//STORAGE RELATED FUNCTIONS

//This function deletes the first pastPassword if the array exceeds the maximun count and puts element at the start of the array
function updatePastPasswords(password, passStrength) {
	if (maxPastPasswordsCount != pastPasswords.length) {
		//this means the maxPastPasswordsCount changed by programmer. A mockup array replaces the history
		pastPasswords = buildPairs(null, null, maxPastPasswordsCount);
	}

	var newPastPasswordPair = new PairDescValue(password, passStrength);
	if (pastPasswords.length >= maxPastPasswordsCount) {
		pastPasswords.shift(); //deletes the first element of the array
	}
	pastPasswords.push(newPastPasswordPair);

	window.localStorage.setItem(passwordsKey, JSON.stringify(pastPasswords));
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
		pastPasswords = buildPairs(null, null, maxPastPasswordsCount);
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
			"- Press Escape or the Help button to view tips",
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
		updateHistoryTable(); //Visual refresh to the history table

		loadPasswordType(); //Visual refresh to input type and toggle button
		makeGuideAlert = true; //Reset the flag to make guide alert on the next visit
		window.localStorage.setItem(guideAlertKey, JSON.stringify(makeGuideAlert));
	}
}

function loadVisualMode() {
	let mode = window.localStorage.getItem(darkSwitchKey);
	setDarkModeAssets(mode != null);
}

function setDarkModeAssets(enableDarkMode) {
	if (enableDarkMode) {
		logoContainer.src = secondaryLogoPath;
		pageIcon.href = secondaryPageIconPath;
	} else {
		logoContainer.src = logoPath;
		pageIcon.href = pageIconPath;
	}
}

function updateMode() {
	let mode = window.localStorage.getItem(darkSwitchKey);

	if (/Edge/.test(navigator.userAgent)) {
		//Fix for Edge Browser bug where the assets were set with the opposite mode
		setDarkModeAssets(mode != null);
		return;
	}

	setDarkModeAssets(mode == null);
}

function loadPasswordType() {
	let aux = window.localStorage.getItem(showPasswordKey);
	showPassword = JSON.parse(aux);
	if (!showPassword || showPassword == "undefined") {
		showPassword = false; //If showPassword was undefined
	}
	togglePassAux(showPassword);
	console.log("Cargo con " + showPassword);
}

function toggleVisiblePassword() {
	console.log("Entro con valor " + showPassword);
	let aux = window.localStorage.getItem(showPasswordKey);
	showPassword = Boolean(JSON.parse(aux));
	showPassword = !showPassword;
	togglePassAux(showPassword);
	window.localStorage.setItem(showPasswordKey, JSON.stringify(showPassword));
	console.log("Salgo con valor " + showPassword);
}

function togglePassAux(bool) {
	if (bool) {
		passwordField.type = "text";
		togglePasswordIcon.className = " fa fa-eye fa-lg";
	} else {
		passwordField.type = "password";
		togglePasswordIcon.className = " fa fa-eye-slash fa-lg";
	}
}