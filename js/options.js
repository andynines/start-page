/*
options.js
*/

function saveOptions() {
	chrome.storage.sync.set({
		masterName: document.getElementById("master-name").value,
		zipCode: document.getElementById("zip-code").value,
		apiKey: document.getElementById("api-key").value
	}, function() {
		var statusElem = document.getElementById("status");
		statusElem.innerHTML = "Options saved";
		setTimeout(_ => statusElem.innerHTML = "", 2000);
	});
}

function restoreOptions() {
	chrome.storage.sync.get({
		masterName: "Human",
		zipCode: "19104", // Default to cheesesteak captial of the U.S.
		apiKey: -1
	}, function(items) {
		document.getElementById("master-name").value = items.masterName;
		document.getElementById("zip-code").value = items.zipCode;
		document.getElementById("api-key").value = items.apiKey;
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
