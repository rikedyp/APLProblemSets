var runURL = "https://tio.run/cgi-bin/run";
var quitURL = "https://tio.run/cgi-bin/quit";
var runString = ["Vlang","1","apl-dyalog","Vargs","0","F.input.tio","0","F.code.tio"];
var testString = "{a←⎕JSON ⍺ ⋄ b e←⍎¨¨a.(a b) ⋄ +/((⍎a.f)¨¨b e)≡¨((⍎⍵)¨¨b e)}";
var runRequest;

function $(selector, parent) {
	return (parent || document).querySelector(selector);
}

function $$(selector, parent) {
	return (parent || document).querySelectorAll(selector);
}

function submit(p) {
  console.log("submit " + p);  
  var problem = problems[p];
  var sol = $("#s" + p).value;
  var t = JSON.parse("{\"a\":[5,4,3,2]}");
  var test = "⎕←" + "'" + doubleQuotes(JSON.stringify(problem)) + "' " + testString + " '" + doubleQuotes(sol) + "'";
  tioRequest(test); 
  // 0: Failed
  // 1: Basic pass
  // 2: Full pass
}

function doubleQuotes(string){
  var s = string.split("'");  
  return s.join("''");
}

function tioRequest(code){
  runRequest = new XMLHttpRequest;
  runRequest.open("POST", runURL, true);
  runRequest.responseType = "arraybuffer";
  runRequest.onreadystatechange = runRequestOnReadyState;
  var req = deflate(codeToByteString(code));
  runRequest.send(req);
}

function iterate(iterable, monad) {
	if (!iterable)
		return;
	for (var i = 0; i < iterable.length; i++)
		monad(iterable[i]);
}

function runRequestOnReadyState() {
	if (runRequest.readyState != XMLHttpRequest.DONE)
		return; 
  console.log(runRequest.status);
  console.log(runRequest.statusText);
	var response = byteArrayToByteString(new Uint8Array(runRequest.response));
	var statusCode = runRequest.status;
	var statusText = runRequest.statusText;

  // Reset requests
	runRequest = undefined;
  runString = ["Vlang","1","apl-dyalog","Vargs","0","F.input.tio","0","F.code.tio"]

	if (statusCode >= 400) {
		sendMessage("Error " + statusCode, statusCode < 500 ? response || statusText : statusText);
		return;
	}

	try {
		var rawOutput = inflate(response.slice(10));
	} catch(error) {
		sendMessage("Error", "The server's response could not be decoded.");
		return;
	}

	try {
		response = byteStringToText(rawOutput);
	} catch(error) {
		response = rawOutput;
	}

	if (response.length < 32) {
		sendMessage("Error", "Could not establish or maintain a connection with the server.");
	}

	var results = response.substr(16).split(response.substr(0, 16));
  console.log(results[0]);
  var errors = response.split("\n");
  var e = errors[0].split(" ");
  console.log(e.slice(5,7).join(" "));
	var warnings = results.pop().split("\n");
	var outputTextAreas = $$("#interpreter textarea.output");

	iterate(warnings, function(warning) {
		if (warning !== "")
			sendMessage(results.toString() ? "Warning" : "Error", warning);
	});

	iterate(outputTextAreas, function(outputTextArea) {
		outputTextArea.value = results.shift() || "";
		resize(outputTextArea);
	});
}

function deflate(byteString) {
	return pako.deflateRaw(byteStringToByteArray(byteString), {"level": 9});
}

function inflate(byteString) {
	return byteArrayToByteString(pako.inflateRaw(byteString));
}

function textToByteString(string) {
	return unescape(encodeURIComponent(string));
}

function byteStringToText(byteString) {
	return decodeURIComponent(escape(byteString));
}

function byteStringToByteArray(byteString) {
	var byteArray = new Uint8Array(byteString.length);
	for(var index = 0; index < byteString.length; index++)
		byteArray[index] = byteString.charCodeAt(index);
	byteArray.head = 0;
	return byteArray;
}

function byteArrayToByteString(byteArray) {
	var retval = "";
	iterate(byteArray, function(byte) { retval += String.fromCharCode(byte); });
	return retval;
}

function sendMessage(title, text) {
	console.log(title + ":" + text);
}

function codeToByteString(code) {
  var value = textToByteString(code);
  runString.push(value.length);
  runString.push(value);
  runString.push("R");
  return runString.join("\0");       
}
