var lastResponse;
var shifted;
var runURL = "https://tio.run/cgi-bin/run";
var runString = ["Vlang","1","apl-dyalog","Vargs","0","F.input.tio","0","F.code.tio"];
var runRequest;
var currentProblem;
var version = 1.1;

function $(selector, parent) {
	return (parent || document).querySelector(selector);
}

function $$(selector, parent) {
	return (parent || document).querySelectorAll(selector);
}

window.onload = function() {
  document.addEventListener("keyup", function(event) {
    console.log(event.keyCode);
    if (shifted && event.keyCode === 13) {
      event.preventDefault();
      console.log("cancellable----");
      console.log(event.cancelable);
      console.log("cancellable----");
      document.getElementById("submit").click();
      console.log("enter");
    }
    if (event.keyCode === 17) {
      shifted = false;
    }
  });
  document.addEventListener("keydown", function(event) {
    if (event.keyCode === 17) {
      shifted = true;
    }
  });
}

function submit() {
  var aplscript = document.getElementById("aplscript");
  console.log(version);
  console.log(aplscript.value);
  var input = aplscript.value.split("\n");
  var rgx = /^.*←/;
  var tioDyalog = "∇ FunWrapper\n" + jsDisp + "\n:Trap 0\n";
  input.forEach(function(line) {
    var trimmed = line.trim(" ");
    console.log(trimmed);
    console.log(rgx.test(trimmed));
    if (rgx.test(trimmed)) {
      tioDyalog += trimmed + "\n⎕←'<br>'\n";
    } else if (trimmed.startsWith("⍝"))  {
      console.log(trimmed);
    } else if (trimmed == "") {
    } else {
      tioDyalog += "⎕←(⎕UCS 13),⍤1⍨disp " + trimmed  + "\n⎕←'<br>'\n";
    }  
// (' '⎕R' '),    
  });
  tioDyalog += "\n⎕←'eRRt0KEN'\n:Else\n⎕←⎕DMX.(EM,'<br>',Message,'<br>')\n⎕←'eRRt0KEN'\n:EndTrap\n∇\nFunWrapper"  
  console.log(tioDyalog);
  tioRequest(tioDyalog);
  // console.log(test);
  // tioRequest(test); 
  // 0: Failed
  // 1: Basic pass
  // 2: Full pass
}

function outResult(result, error) {
  var out = document.getElementById("output");
  console.log("---------RESULT------------");
  console.log(result);
  console.log("---------ERRROR-----------");
  console.log(error);
  out.innerHTML = result + error;
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

  lastResponse = response;
	var results = response.substr(16).split(response.substr(0, 16));
  var errors = response.split("eRRt0KEN");
  console.log(errors);
  var e = errors[1].split("\n ");
  console.log(e);
  var error = e.slice(5,7).join(" ");
	var warnings = results.pop().split("\n");
	var outputTextAreas = $$("#interpreter textarea.output");  
  console.log(errors[0]);
  outResult(results[0].slice(0,results[0].length-9), error);
  
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