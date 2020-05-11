"use strict";

//Progress bar update
function updateBar(value) {
	updatingBar = true;
	let elem = document.getElementById(barId);
	let width = 0;
	let id = setInterval(frame, 1);
	function frame() {
		if (width <= value) {
			width += arrive(width, value);
			elem.style.width = width + "%";
			elem.innerHTML = width.toFixed(0) + "%";
		} else {
			clearInterval(id);
			updatingBar = false;
		}
	}
}
//Arrive steering behaviour
function arrive(position, target) {
	let thresholdRadius = target * 0.5;
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
	//Mockup strength calculation
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
	let strengthDisplay = document.getElementById(strengthDisplayId);
	strengthDisplay.style.visibility = "visible";
	updateBar(passStrength);
	let para = document.createElement("P"); //Where the result content goes
	if (passStrength < 35) {
		strengthDisplay.className = "alert alert-danger";
		let linkElem = document.createElement("A");
		linkElem.href =
			"https://www.mentalfloss.com/article/504786/8-tips-make-your-passwords-strong-possible";
		linkElem.className = " alert-link";
		let linkText = document.createTextNode("Learn more");
		linkElem.appendChild(linkText);
		let displayText = document.createTextNode("Your password is vulnerable! ");
		para.appendChild(displayText);
		para.appendChild(linkElem);
	} else {
		if (passStrength < 70) {
			strengthDisplay.className = "alert alert-warning";
			let emElem = document.createElement("EM");
			let emText = document.createTextNode("weak");
			emElem.appendChild(emText);
			let displayText = document.createTextNode("Your password looks ");
			para.appendChild(displayText);
			para.appendChild(emElem);
		} else {
			strengthDisplay.className = "alert alert-success";
			let strongElem = document.createElement("STRONG");
			let strongText = document.createTextNode("strong!");
			strongElem.appendChild(strongText);
			let displayText = document.createTextNode("Your password is ");
			para.appendChild(displayText);
			para.appendChild(strongElem);
		}
	}
	strengthDisplay.replaceChild(para, strengthDisplay.firstChild); //Updates the alert with the new content
}

function hasMinLength(password) {
	return password.length >= minLength;
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
	return !(res == 0);
}
function hasLowerCase(password) {
	let upperCasePassword = password.toUpperCase();
	let res = password.localeCompare(upperCasePassword);
	return !(res == 0);
}
