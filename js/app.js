"use strict"; //For cleaner code

//Global Variables and classes
const minLength = 6;
const maxPastPasswordsCount = 5;

const logoPath = "assets/logo.png";
const pageIconPath = "assets/pageIcon.png";
const secondaryLogoPath = "assets/secondaryLogo.png";
const secondaryPageIconPath = "assets/secondaryPageIcon.png";
const lowPasswordSoundPath = "assets/audio/robloxdeath.mp3";
const mediumPasswordSoundPath = "assets/audio/hammer.mp3";
const highPasswordSoundPath = "assets/audio/musicbox.mp3";

var logoContainer = document.getElementById("logo-container");
var pageIcon = document.getElementById("page-icon");
var passwordField = document.getElementById("password-field");
const testButton = document.getElementById("test-button");
const helpButton = document.getElementById("help-button");
const testAudio = document.getElementById("test-password-audio");
var strengthDisplay = document.getElementById("strength-display");
var helpModalBody = document.getElementById("modal-body");
var bar = document.getElementById("myBar");
var togglePasswordIcon = document.getElementById("toggle-password-icon");
const resultTableId = "result-table";
const resultTableParentId = "result-table-col";
const historyTableId = "history-table";
const historyTableParentId = "history-table-col";
const alertZoneId = "alert-zone";
const guideZoneId = "guide-zone";

const darkSwitchKey = "dark-switch";
const passwordsKey = "passwordsKey";
const guideAlertKey = "guideAlertKey";
const showPasswordKey = "showPasswordKey";
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
var showPassword;
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

/**
 * Builds an array of Pairs with the descs and vals arrays of same size. Can build mockup arrays
 * @param {any[]} descs - description array
 * @param {any[]} vals - value array. It length must match descs's if none of them are null.
 * @param {Number} length - length of the return array. Must match descs or vals if they arent null
 * @returns {any[]} An array of Pairs with the descs and vals values
 */
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
//USER INTERFACE RELATED FUNCTIONS

window.onload = onloadPage;
function onloadPage() {
	usingAlertSpace = false;
	loadVisualMode();
	initializeHelpModal();
	loadGuideAlert();
	loadPastPasswords();
	loadPasswordType();

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

	//Initialize tooltip elements to work properly
	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	})
}

//Enter key handler for testPassword
passwordField.addEventListener("keyup", (event) => {
	if (event.key !== "Enter") return;
	testButton.click();
	event.preventDefault();
});

//Escape key handler for help Modal
document.addEventListener("keyup", (event) => {
	if (event.key !== "Escape") return;
	helpButton.click();
	event.preventDefault();
});

//History table key handler
document.addEventListener("keyup", (event) => {
	if (event.key !== "h" || passwordField == document.activeElement) return;
	//Only works if the password input field is not selected
	toggleHistoryTable();
	event.preventDefault();
});

let currentPass = "";



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
		let passwordResults = [];
		//This calls on every passwordProperties function and stores its result on passwordValues
		for (let i = 0; i < passwordProperties.length; i++) {
			passwordResults.push(passwordProperties[i].apply(null, [password]));
		}

		let passStrength = computeStrength(passwordResults);
		showStrength(password, passStrength);
		playTestSound(passStrength);
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

function initializeHelpModal() {
	let list = makeUL(helpModalTips);
	helpModalBody.appendChild(list);
}
/**
 *
 * @param {*array} array - an array of string
 * @returns ul DOM object filled with the array elements
 */
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
	window.open("https://github.com/TomasDiez99/proyecto-1/issues", "_blank");
}

function openFaLink() {
	window.open(
		"https://fontawesome.com/", "_blank");
}

function openUNSLink() {
	window.open(
		"https://cs.uns.edu.ar/home/", "_blank");
}

function playTestSound(strength) {
	testAudio.pause(); //Pauses the last sound executed before playing the next one
	const lowValue = 35;
	const medValue = 70;
	if (strength < lowValue) {
		testAudio.src = lowPasswordSoundPath;
	} else {
		if (strength < medValue) {
			testAudio.src = mediumPasswordSoundPath;
		} else {
			testAudio.src = highPasswordSoundPath;
		}
	}
	testAudio.load(); //Update the changes made
	testAudio.play();
}
