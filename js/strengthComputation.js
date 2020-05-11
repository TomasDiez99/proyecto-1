"use strict";

//Progress bar update
function updateBar(value) {
	updatingBar = true;
	let elem = document.getElementById(barId);
	let width;
	let aux = parseFloat(elem.innerHTML);
	let updateOffset = 0.5;
	Number.isNaN(aux) ? (width = 0) : (width = aux); //The first time, the parseFloat gives a NaN return;

	let last = Date.now();
	const epsilon = 0.005;
	function frame() {
		let current = Date.now();
		let dt = (current - last) / 1000;

		let step = arrive(width, value, dt);
		if (Math.abs(step) > epsilon) {
			width += step;
			elem.style.width = width + "%";
			elem.innerHTML = width.toFixed(0) + "%";

			requestAnimationFrame(frame);
		} else {
			elem.style.width = value + "%";
			elem.innerHTML = value + "%";

			updatingBar = false;
		}
		last = current;
	}
	requestAnimationFrame(frame);
}

//Optimizes the sqrt function
function inverseSqrEase(t) {
	//t is in [0,1]
	t = 1 - t;
	t = t * t * t;
	return 1 - t;
}

function arriveEase(rad, dist) {
	if (dist > rad) {
		return rad;
	}
	let t = dist / rad;
	return t * rad;
}

//Arrive steering behaviour
function arrive(position, target, dt) {
	const thresholdRadius = target * 0.5;
	const speed = 2;

	let direction = Math.sign(target - position);
	let distance = Math.abs(target - position);
	return direction * arriveEase(thresholdRadius, distance) * speed * dt;
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
