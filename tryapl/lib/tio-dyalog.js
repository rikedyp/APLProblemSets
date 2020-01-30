var apltioversion = 2.15;
var prevCount = 0;
var ctrld = false;
var shiftd = false;
var debug = false;
var help = false;
var lastRequest;
var lastResponse;
var submittedLines = [];
var oldText;
var lastText;
var init = true;
var cursorPos;
var oneTimeToken;
var currentWS = ["78DA95D4055415411480E105E4A188028A8A85128A848A8A220A8A2DA2A8D80108986012768BDD1D58207677778BDD8DDDDDADFF957D9EF39E60BC73BE7777EFECDE9DD999D9E4441345F767A446034B0B4B8909FD7F35A5933FEDF5E7EAE8DE975E8DC60D94547FDFD55FB87A9E595BA7B1EEFD3A0F937E28CAB094FB53AF9B567F2CD498439312CDF4EA9A674B89712EF143E26235DEBFF276A9F7439B37D0CF5BFD396F9A461D258DEBD3CA1BFD65BCC67AE3D5AF93CFF1DFDE9B46AF8EA17A1EABAD63A5E80E589D3B196726E457DFB5467D466E6440297B4589A058018EA52B3D398F4130C7210845185AA2155AA30DDAA21D64DD44A03D3AA0233AA133BA20125188460CBAA21BBAA3873C4FEDB28C67258A482D9EEF462C86E22801779494FEC203A5E1A9BEFF04E66E3ED101F3E45CC649AE02B1222AA132AAA02AAAA13A7C51037EA8895AF0476DC8EBAF8B00D4437DC8166A884690EDD1044DD5B99479FE8A8DE8276D8C6137710FF6E2200EE108927014C7701C277012A771066765FE7109977105D7F00DB7F1042FF00A6FD10BCB98E03E327EC6EDC1B31771BC0BFBB01F0764CEC81F269EC2795CC45524E3066EE216EEE02EEEE13E1EE0211EE1319","EE2199EE3259AA128CA53BF39D187E8256B86BE78CBBA219623B6201682230A73EE82F7B820F7CA5A251FCDBD7D391E6FAB281311C579128BD359D633C7A630E13A6BA9456E2071109CE02CEB0089E84D5B59B8CA3AE49E4804C00FBEF0C614AE0B267AC256E697E82FFB01E108A13D14AF697B8377F800F954D0ACD8A020D6C19A3E5AC00C56F0920D853C70803B5C61081F9A3EE2133E23085FE4FD485D8A6F2096917DC2437612E3651EC98FA393131048DE895CA0EC7BCCC5424C261F8430FB94BDF0F3BB60A7F75D70712DD3ACB9C6C42083A1B151FA4B9FD21DBD70D1DBEC72A6CD1FD62DDEB3A8C84CB762C54BB8972CE551DAF3C5EEB90989CBEE57A858A97295AAD5AAFBD6F0AB59CBBF769DBA01F5EA3768D8A87193A671B33F3EB6786A9925AB55B6EC39AC73E6CA9D27AF4DBEFCB676F60E050A3A167272EEB5ABCFCAE0CFAFCB97F3FAD2BFF095E741AF068484860D1C14DBB2D590D66DDAB60B8F683FB443C74E9D872D1DDE25326A44F4C851A3C7741D3B6EFC848993264FE93675DAF4EE337A9C39DBF3DC92F30F1E3E7A121893B1F7DB55EF56FB6C5CBEE9D9C205DBB6CF3F753A7EDE96AD87CBF6DDB9E3CDFA0DA6FD920ECD9A73F0C0F1FDC75ABCFF76E4FBE093278AEEDDB76685F9CBCC5F6FDEBB7E2DF9EAADDB77EFDC58ABFD1E9BDBFCF6B99415E6A6FF7D1F6CA8FCD7EF07C08C18C2"];
var runURL = "https://tio.run/cgi-bin/run";
var runString     = ["Vlang","1","apl-dyalog","Vargs","0","F.code.tio","0","F.input.tio"];
var runRequest;

$=s=>document.querySelector(s);
$$=s=>document.querySelectorAll(s);

firstText="Dyalog APL/TIO Version " + apltioversion + "\n" + 
         Date().split(" ").slice(0,5).join(" ") + 
      "\nCopyright (c) Dyalog Limited 1982-" + Date().split(" ")[3] + 
      "\n      ";
oldText = firstText;      
lastText = oldText;

function loadTioDyalog() {
  console.log("tio.html v." + apltioversion);  
  var s=new URLSearchParams(location.search)
  html.className=0==s.get("g")?"g":0==s.get("b")?"b":""  
  // Handle keyboard input
  document.addEventListener("keydown", function(event) {     
    // log(event.keyCode);
    if (!shiftd && !ctrld && !session.disabled && event.keyCode === 13) {  
      // Recall submittedLines
      prevCount = submittedLines.length + 1;
      submitLine();           
      event.preventDefault();      
    } else if (shiftd && event.keyCode === 27) {
      replaceCurrentLine("");
    } else if (shiftd && ctrld) {
      if (event.keyCode === 8 || event.keyCode === 13) {       
        log("prevCount0:"+prevCount)
        prevCount = Math.min(Math.max(-1, prevCount + (event.keyCode - 10.5) / 2.5), submittedLines.length); // 8:-1, 13:+1;        
        log("prevCount1:"+prevCount)
        replaceCurrentLine(submittedLines.concat("").slice(prevCount)[0])
      } 
    }
    if (event.keyCode === 17) {ctrld = true;}
    if (event.keyCode === 16) {shiftd = true;}
  });
  document.addEventListener("keyup", function(event) {
    if (event.keyCode === 17) {ctrld = false;}
    if (event.keyCode === 16) {shiftd = false;}
  });
  session.value=oldText;
  // Handle URL queries
  if (expr = s.get("a")) {session.value += decodeURIComponent(expr); if(null!=s.get("run")) {submitLine();prevCount += 1;}}   
}

permaLink=_=>{
  currentLine = getCurrentLine()
  history.replaceState({},document.title,location.pathname + "?a=" + encodeURIComponent(currentLine.trim()) + "&run");
}

log=text=>{if(debug){console.log(text)}}

putCursor=p=>session.selectionEnd=session.selectionStart=p

replaceCurrentLine=text=>{
  cursorPos = session.selectionStart
  r = new RegExp("(.|\n){0," + (cursorPos-1) + "}\n")
  beginCur=session.value.match(r)[0].length
  head = session.value.slice(0,beginCur)
  tail = session.value.slice(beginCur,session.value.length).replace(/.*/,"      ")
  log(tail)
  session.value=head + text + tail
  putCursor(beginCur+6)
}

padSession=_=>{
  cursorPos = session.selectionStart;
  session.value+="\n      ".repeat(0)
  putCursor(cursorPos);
}

strip=what=>{
  cursorPos = session.selectionStart;
  if (what==="oldText"){
    oldText=oldText.replace(/\s+$/,"");
  }else{
    session.value=session.value.replace(/\s+$/,"");
  }
  putCursor(cursorPos);
}

getCurrentLine=_=>{
  cursorPos = session.selectionStart;
  strip("oldText")  
  r = new RegExp("(.|\n){0," + cursorPos + "}\n");  
  return ("\n" + session.value).replace(r,'').split("\n")[0];   
}

function submitLine() {
  session.disabled = true;
  init = false;
  oldText=session.value 
  currentLine = getCurrentLine();
  if (currentLine.replace(/\s/g, '').length) {submittedLines.push(currentLine);}
  log(currentLine);
  session.value += "\n";  
  
  oneTimeToken = "'" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + "'";
  
  CW = "∆WS∆←''\n";
  currentWS.forEach(function(line){    
    CW += "∆WS∆,←'" + line + "'\n";
  });  
  
  importWS = CW + "'#' ⎕NS 0(220⌶)¯2(219⌶)¯128+256|128+16⊥⍉(⊢⍴⍨2,⍨2÷⍨≢)⎕IO-⍨(⎕D,⎕A)⍳(⎕EX⊢⍎)'∆WS∆'\n";
  
  quadSE = "⎕SE.(⎕WS'Event'('SessionPrint' 'd')⊣⎕CY'dfns')\n⎕SE.d←{(1=≡⍺)∧⍬≡⍴⍺:⎕←⍺dft 0⋄⎕←disp⍺}\n";   
  
  exportWS  = "\n∆WS∆←(⎕D,⎕A)[,⍉⎕IO+16 16⊤256|⎕IO⊃⌽2 9(219⌶)1(220⌶)⎕NS⎕NL-⍳9]\n";  
  exportWS += "∆GUWSID∆←(⎕A,⎕D)[?12⍴36]\n";
  exportWS += "∆WS∆←2000{((≢⍵)⍴⍺↑1)⊂⍵}∆WS∆\n";
  exportWS += "⍞←∊(⊂∆GUWSID∆),¨∆WS∆\n⍞←" + oneTimeToken + "\n⍞←∆GUWSID∆\n"

  lastRequest = quadSE + importWS + "⍞←" + oneTimeToken + "\n" + currentLine + "\n⍞←" + oneTimeToken + "\n" + exportWS;
  tioRequest(lastRequest);  
}

function tioRequest(code){
  runRequest = new XMLHttpRequest;
  runRequest.open("POST", runURL, true);
  runRequest.responseType = "arraybuffer";
  runRequest.onreadystatechange = runRequestOnReadyState;
  var req = deflate(codeToByteString(code));
  runRequest.send(req);
}

// - TIO CODE FOLLOWS
function deflate(byteString) {return pako.deflateRaw(byteStringToByteArray(byteString), {"level": 9});}
function inflate(byteString) {return byteArrayToByteString(pako.inflateRaw(byteString));}
function textToByteString(string) {return unescape(encodeURIComponent(string));}
function byteStringToText(byteString) {return decodeURIComponent(escape(byteString));}
function byteStringToByteArray(byteString) {
  var byteArray = new Uint8Array(byteString.length);
  for(var index = 0; index < byteString.length; index++)byteArray[index] = byteString.charCodeAt(index);
  byteArray.head = 0;
  return byteArray;
}
function byteArrayToByteString(byteArray) {
  var retval = "";
  iterate(byteArray, function(byte) { retval += String.fromCharCode(byte); });
  return retval;
}
function sendMessage(title, text) {console.log(title + ":" + text);}
function codeToByteString(code) {
  var value = textToByteString(code);
  runString.push(value.length);runString.push(value);runString.push("R");
  return runString.join("\0");
}
function iterate(iterable, monad) {if (!iterable)return;for (var i = 0; i < iterable.length; i++)monad(iterable[i]);}
function runRequestOnReadyState() {
  if (runRequest.readyState != XMLHttpRequest.DONE)return; 
  var response = byteArrayToByteString(new Uint8Array(runRequest.response));
  var statusCode = runRequest.status;
  var statusText = runRequest.statusText;
  // Reset requests
  runRequest = undefined;
  runString = ["Vlang","1","apl-dyalog","Vargs","0","F.code.tio","0","F.input.tio"];
  if (statusCode >= 400) {sendMessage("Error " + statusCode, statusCode < 500 ? response || statusText : statusText);return;}
  try {
    var rawOutput = inflate(response.slice(10));
  } catch(error) {
    sendMessage("Error", "The server's response could not be decoded.");
    return;
  }
  try {response = byteStringToText(rawOutput);}catch(error) {response = rawOutput;}
  if (response.length < 32) {sendMessage("Error", "Could not establish or maintain a connection with the server.");}
// - END OF TIO CODE

  var output = response.replace(new RegExp(response.slice(0,16).replace(/\W/g,t=>"\\"+t),"g"),"").split("\n").slice(0,-5).join("\n");
  lastResponse = output;
  var splitOut = output.split(oneTimeToken.slice(1,oneTimeToken.length -1));
  var newLine = splitOut[0];
  newLine = newLine.slice(0, newLine.length - 1);
  log("NEW: " + newLine);
  log(splitOut)
  newLine=splitOut[0].slice(0,splitOut[0].length-1)+splitOut[1].slice(!splitOut[0],splitOut[1].length-1)
  if(splitOut.length == 4) {
    GUWSID = splitOut[3].slice(1, splitOut[3].length - 1);
    currentWS = splitOut[2].split("\n")[1].split(GUWSID);
  }
  //if (!init) {
  //  session.value = lastText + "";
  //}
  if (newLine === "") {
    log("no result");
    session.value = lastText.slice(0, lastText.length - 6) + currentLine + "\n      ";
  }  // user pressed enter with cursor inside last line of session
                        //← session length→//   //←       length of last line            →//
  else if (cursorPos > oldText.length - oldText.split("\n").slice(-1).length) {
    log("else if:"+(cursorPos > session.value.length - session.value.split("\n").slice(-1).length))
    session.value = session.value.slice(0,session.value.length - 7)
    session.value = oldText + "\n" + newLine + "\n      "
    log("fresh");
  } else { // user pressed enter on old line (input or output) in session
    session.value = lastText.slice(0,lastText.length - 7)
    strip("session")
    session.value += "\n" + currentLine + "\n" + newLine + "\n      ";
    log("stale");
  }
  padSession()
  lastText = session.value;
  session.scrollTop = session.scrollHeight;
  session.disabled = false;
}
