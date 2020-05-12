"use strict"; //For cleaner code

//MUST BE IMPORTED BEFORE STORAGE.JS IN HTML IMPORT
//Global Variables and classes
const minLength = 6;
const maxPastPasswordsCount = 5;

const logoPath = "assets/logo.png";
const pageIconPath = "assets/pageIcon.png";
const secondaryLogoPath = "assets/secondaryLogo.png";
const secondaryPageIconPath = "assets/secondaryPageIcon.png";

var logoContainer = document.getElementById("logo-container");
var pageIcon = document.getElementById("page-icon");
var passwordField = document.getElementById("password-field");
const testButton = document.getElementById("test-button");
var strengthDisplay = document.getElementById("strength-display");
var helpModal = document.getElementById("myModal");
var helpModalBody = document.getElementById("modal-body");
var bar = document.getElementById("myBar");
const resultTableId = "result-table";
const resultTableParentId = "result-table-col";
const historyTableId = "history-table";
const historyTableParentId = "history-table-col";
const alertZoneId = "alert-zone";
const guideZoneId = "guide-zone";

const darkSwitchKey = "dark-switch";
const passwordsKey = "passwordsKey";
const guideAlertKey = "guideAlertKey";
const helpModalTips = [
	"Press H to toggle on/off the history table",
	"You can always delete the history by clicking the 'Clear Data' button",
	"Try the dark mode by clicking the switch at the upper right corner!",
];
const resultTableHeaderDesc = ["Propierties of your password", ""]; //Last element is for completion of visual borderer on header
const resultTableBodyDesc = [
	"At least " + minLength + " characters",
	"Has Numbers",
	"Has Letters",
	"Has Symbols",
	"Upper Case",
	"Lower Case",
];
const historyTableHeaderDesc = [
	"Last " + maxPastPasswordsCount + " password(s)",
	"Strength",
];
const passwordProperties = [
	hasMinLength,
	hasNumber,
	hasLetter,
	hasSymbols,
	hasUpperCase,
	hasLowerCase,
];
var makeGuideAlert = false;
var usingAlertSpace = false;
var updatingBar = false;
var pastPasswords = [];

/**
 * Pair class that stores two attributes for flexible usage
 */
class PairDescValue {
	constructor(desc, val) {
		this._desc = desc;
		this._val = val;
	}
	get desc() {
		return this._desc;
	}
	get val() {
		return this._val;
	}
	set desc(desc) {
		this._desc = desc;
	}
	set val(val) {
		this._val = val;
	}
}

//Builds an array of Pairs with the descs and vals arrays of same size. Can build mockup arrays
function buildPairs(descs, vals, length) {
	let pairs = [];

	if (descs == null) {
		descs = [];
		for (let i = 0; i < length; ++i) {
			descs.push("-");
		}
	}
	if (vals == null) {
		vals = [];
		for (let i = 0; i < length; ++i) {
			vals.push("-");
		}
	}

	for (let i = 0; i < length; i++) {
		pairs.push(new PairDescValue(descs[i], vals[i]));
	}
	return pairs;
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//User interface related functions

//Onload page
window.onload = onloadPage;
function onloadPage() {
	usingAlertSpace = false;
	loadMode();
	initializeHelpModal();
	loadGuideAlert();
	loadPastPasswords();
	initializeTable(
		historyTableParentId,
		historyTableId,
		historyTableHeaderDesc,
		pastPasswords
	);
	initializeTable(
		resultTableParentId,
		resultTableId,
		resultTableHeaderDesc,
		buildPairs(resultTableBodyDesc, null, resultTableBodyDesc.length)
	);
}
//Enter key handler for testPassword
passwordField.addEventListener("keyup", (event) => {
	if (event.key !== "Enter" || updatingBar) return; //Doesnt work while updating the progress bar of the last test
	testButton.click();
	event.preventDefault();
});

//History table key handler
document.addEventListener("keyup", (event) => {
	if (event.key !== "h" || passwordField == document.activeElement) return;
	//H letter keyCode. Only works if the password input field is not selected
	toggleHistoryTable();
	event.preventDefault();
});

function testPassword() {
	if (updatingBar) {
		return;
	} //Dont want to analyze passwords while updating passwords

	let password = passwordField.value;
	if (0 == password.localeCompare("")) {
		//If the user enters a empty string as input
		if (!usingAlertSpace) {
			usingAlertSpace = true;
			createAlert(
				"Oops!",
				"Try again",
				"Looks like you didn't insert a password",
				"warning",
				false,
				true,
				alertZoneId,
				usingAlertSpace
			);
		}
	} else {
		passwordField.value = ""; //Clears the input field
		var passwordResults = [];
		//This calls on every passwordProperties function and stores its result on passwordValues
		for (let i = 0; i < passwordProperties.length; i++) {
			passwordResults.push(passwordProperties[i].apply(null, [password]));
		}

		let passStrength = computeStrength(passwordResults);
		showStrength(passStrength);

		let resultTablePairs = buildPairs(
			resultTableBodyDesc,
			passwordResults,
			passwordResults.length
		);
		updateTables(password, resultTablePairs, passStrength);
	}
}

//reutilized code from https://codepen.io/codysechelski/pen/dYVwjb
function createAlert(
	title,
	summary,
	details,
	severity,
	dismissible,
	autoDismiss,
	appendToId,
	alertSpace
) {
	var iconMap = {
		info: "fa fa-info-circle",
		success: "fa fa-thumbs-up",
		warning: "fa fa-exclamation-triangle",
		danger: "fa ffa fa-exclamation-circle",
	};

	var iconAdded = false;

	var alertClasses = ["alert", "animated", "flipInX"];
	alertClasses.push("alert-" + severity.toLowerCase());

	if (dismissible) {
		alertClasses.push("alert-dismissible");
	}

	var msgIcon = $("<i />", {
		class: iconMap[severity], // you need to quote "class" since it's a reserved keyword
	});

	var msg = $("<div />", {
		class: alertClasses.join(" "), // you need to quote "class" since it's a reserved keyword
	});

	if (title) {
		var msgTitle = $("<h4 />", {
			html: title,
		}).appendTo(msg);

		if (!iconAdded) {
			msgTitle.prepend(msgIcon);
			iconAdded = true;
		}
	}

	if (summary) {
		var msgSummary = $("<strong />", {
			html: summary,
		}).appendTo(msg);

		if (!iconAdded) {
			msgSummary.prepend(msgIcon);
			iconAdded = true;
		}
	}

	if (details) {
		var msgDetails = $("<p />", {
			html: details,
		}).appendTo(msg);

		if (!iconAdded) {
			msgDetails.prepend(msgIcon);
			iconAdded = true;
		}
	}

	if (dismissible) {
		var msgClose = $("<span />", {
			class: "close", // you need to quote "class" since it's a reserved keyword
			"data-dismiss": "alert",
			onclick: "closeAlert(" + usingAlertSpace + ")", //Inserted code by me to manage guide alert behaviour
			html: "<i class='fa fa-times-circle'></i>",
		}).appendTo(msg);
	}

	$("#" + appendToId).prepend(msg);

	if (autoDismiss) {
		setTimeout(function () {
			msg.addClass("flipOutX");
			setTimeout(function () {
				msg.remove();
				if (alertSpace) {
					usingAlertSpace = false;
				} //Inserted code to manage alert zone behaviour
			}, 1000);
		}, 5000);
	}
}

function closeAlert(usingAlertSpace) {
	if (!usingAlertSpace) {
		//Means we're closing the guide alert
		window.localStorage.setItem(guideAlertKey, JSON.stringify(usingAlertSpace));
	}
}

function helpButton() {
	helpModal.show = true;
}

function initializeHelpModal() {
	let list = makeUL(helpModalTips);
	helpModalBody.appendChild(list);
}

function makeUL(array) {
	let list = document.createElement("ul");
	for (let i = 0; i < array.length; i++) {
		let item = document.createElement("li");
		item.appendChild(document.createTextNode(array[i]));
		list.appendChild(item);
	}
	return list;
}

function openContactLink() {
	window.open(
		"https://github.com/TomasDiez99",
		"Contact",
		"width=800,height=800"
	);
}

function openFaLink() {
	window.open(
		"https://fontawesome.com/",
		"Fontawesome",
		"width=800,height=800"
	);
}

function openUNSLink() {
	window.open(
		"https://cs.uns.edu.ar/home/",
		"Universidad Nacional del Sur",
		"width=800,height=800"
	);
}
