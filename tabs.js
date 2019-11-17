window.onload = function() {
  setTimeout(loadTabs, 500);
}
function loadTabs() {
  console.log("hello");
  // Add language bars and inputs to problems
  var tabs = document.getElementById("tabContainer");
  for (problem in problems) {
    console.log(problem);
    // Add tab button 
    var btn = document.createElement("button");
    btn.classList.add("tabLink");
    btn.innerHTML = problems[problem].title;
    var p = problems[problem];
    btn.onclick = (function(opt) {
      return function() {
        openTab(event, opt);
      };
    })(problem);
    tabs.appendChild(btn);   
    // Add language bar, input field and submit button
    var div = document.getElementById(problem);
    console.log(div);
    var lb = document.createElement("div");
    lb.classList.add("lb");
    var input = document.createElement("input");
    input.id = "s" + problem;
    var submit = document.createElement("button");
    submit.onclick = (function(opt) {
      return function() {
        sub(opt);
      }
    })(problem);
    submit.innerHTML = "Submit";
    div.appendChild(lb);
    div.appendChild(input);
    div.appendChild(submit);
  }
  var lbScript = document.createElement("script");
  lbScript.src = "lb.js";
  document.body.appendChild(lbScript)  
}

function openTab(event, p) {
  console.log("ot");
  console.log(p);
}

function sub(p) {
  submit(p);  
}