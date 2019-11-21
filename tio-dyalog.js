var runURL = "https://tio.run/cgi-bin/run";
var quitURL = "https://tio.run/cgi-bin/quit";
var runString = ["Vlang","1","apl-dyalog","Vargs","0","F.input.tio","0","F.code.tio"];
var testString = "{a←⎕JSON ⍺ ⋄ b e←⍵{0::⍎¨¨⍵.(a b) ⋄ ⍎¨¨¨⍵.(a b)}a ⋄ test←(a.f)∘{0::(⍎⍺)⍵ ⋄ (⊃⍵)(⍎⍺)(2⊃⍵)}¨¨b e ⋄ user←(⍵)∘{0::(⍎⍺)⍵ ⋄ (⊃⍵)(⍎⍺)(2⊃⍵)}¨¨b e ⋄ (⊃∧+/)user≡¨test}";
var runRequest;
var currentProblem;
var congrats = [
  "Congratulations! Your solution passed all of the base and edge cases",
  "Well done! Your function was just what we needed",
  "Awesome! Your solution couldn't be any more correct",
  "Way to go! Your function passed all of our test cases",
];
var version = 1.0;

function $(selector, parent) {
	return (parent || document).querySelector(selector);
}

function $$(selector, parent) {
	return (parent || document).querySelectorAll(selector);
}

function submit(p) {
  currentProblem = p;
  var problem = problems[p];
  var sol = $("#s" + p).value;
  var t = JSON.parse("{\"a\":[5,4,3,2]}");
  var test = "⎕←" + "'" + doubleQuotes(JSON.stringify(problem)) + "' " + testString + " '" + doubleQuotes(sol) + "'";
  tioRequest(test); 
  // 0: Failed
  // 1: Basic pass
  // 2: Full pass
}

function outResult(result, error) {
  var out = document.getElementById("feedback" + currentProblem);
  if (result == 0) {
    out.innerHTML = "That function doesn't seem to work. " + error;
  } else if (result == 1) {
    out.innerHTML = "Passed all basic cases. Try to solve with <code class='apl'>⍵ ← " + problems[currentProblem].b[0] + "</code> for full marks";
  } else if (result == 2) {
    out.innerHTML = goldTrophy;
    out.innerHTML += "  " + congrats[Math.floor(Math.random() * congrats.length)];
  } else {
    out.innerHTML = error;
  }
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
  var errors = response.split("\n");
  var e = errors[0].split(" ");
  var error = e.slice(5,7).join(" ");
	var warnings = results.pop().split("\n");
	var outputTextAreas = $$("#interpreter textarea.output");  
  
  outResult(results[0], error);
  
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

goldTrophy = '<svg class="svg-inline--fa fa-trophy-alt fa-w-18 notsubmitted" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trophy-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M552 64H448V24c0-13.3-10.7-24-24-24H152c-13.3 0-24 10.7-24 24v40H24C10.7 64 0 74.7 0 88v56c0 66.5 77.9 131.7 171.9 142.4C203.3 338.5 240 360 240 360v72h-48c-35.3 0-64 20.7-64 56v12c0 6.6 5.4 12 12 12h296c6.6 0 12-5.4 12-12v-12c0-35.3-28.7-56-64-56h-48v-72s36.7-21.5 68.1-73.6C498.4 275.6 576 210.3 576 144V88c0-13.3-10.7-24-24-24zM64 144v-16h64.2c1 32.6 5.8 61.2 12.8 86.2-47.5-16.4-77-49.9-77-70.2zm448 0c0 20.2-29.4 53.8-77 70.2 7-25 11.8-53.6 12.8-86.2H512v16zm-127.3 4.7l-39.6 38.6 9.4 54.6c1.7 9.8-8.7 17.2-17.4 12.6l-49-25.8-49 25.8c-8.8 4.6-19.1-2.9-17.4-12.6l9.4-54.6-39.6-38.6c-7.1-6.9-3.2-19 6.7-20.5l54.8-8 24.5-49.6c4.4-8.9 17.1-8.9 21.5 0l24.5 49.6 54.8 8c9.6 1.5 13.5 13.6 6.4 20.5z"></path></svg>'