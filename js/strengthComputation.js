"use strict";

//Global variables
const minLength = 5;

//Progress bar update
function updateBar(value) {
	updatingBar = true;
	let strengthDisplay = document.getElementById(strengthDisplayId);
	let elem = document.getElementById("myBar");
	let width = 0;
	console.log("width " + width + " .");
	let id = setInterval(frame, 1);
	function frame() {
		if (width <= value) {
			console.log("arrive return");
			width += arrive(width, value);
			elem.style.width = width + "%";
			elem.innerHTML = width.toFixed(0) + "%";
			strengthDisplay.innerHTML = width;
		} else {
			clearInterval(id);
			updatingBar = false;
		}
	}
}
//Arrive steering behaviour
function arrive(position, target) {
	let thresholdRadius = target / 2;
	let maxSpeed = 0.5;
	let offsetVelocity = 0.002;
	let accelerationTweaker = 0.008;

	let toTarget = target - position;
	let distance = toTarget * Math.sign(toTarget);
	let desiredVelocity = Math.sign(toTarget) * maxSpeed;
	let velocity;

	if (distance < thresholdRadius) {
		//Inside progressive slowdown area
		velocity =
			Math.sign(toTarget) * distance * accelerationTweaker + offsetVelocity;
	} else {
		velocity = desiredVelocity;
	}
	return velocity;
}
function computeStrength(passwordValues) {
	let strength = 0;
	let i = 0;
	while (i < passwordValues.length) {
		if (passwordValues[i]) {
			strength++;
		}
		i++;
	}
	strength = (strength / passwordValues.length).toFixed(2); //round number;
	return strength * 100;
}

function showStrength(passStrength) {
	updateBar(passStrength);
}

function hasMinLength(password) {
	if (password.length >= minLength) {
		return true;
	} else {
		return false;
	}
}

function hasSymbols(password) {
	let regExpr = /[$-/:-?{-~!"^_`\[\]]/; //Not a english letter or a digit (\S) or a white space Regular expression
	return regExpr.test(password);
}

function hasNumber(password) {
	let regExpr = /\d/; //Any digit from 0 to 9 Regular expression
	return regExpr.test(password);
}

function hasLetter(password) {
	let regExpr = /[A-Za-z]/; //Any letter from A to Z or from a to z Regular expression
	return regExpr.test(password);
}

function hasUpperCase(password) {
	let lowerCasePassword = password.toLowerCase();
	let res = password.localeCompare(lowerCasePassword);
	if (res == 0) {
		/*the strings were equals, this mean the password dont have uppercase letters */
		return false;
	} else {
		return true;
	}
}
function hasLowerCase(password) {
	let upperCasePassword = password.toUpperCase();
	let res = password.localeCompare(upperCasePassword);
	if (res == 0) {
		/*the strings were equals, this mean the password dont have lowercase letters */
		return false;
	} else {
		return true;
	}
}
