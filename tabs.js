window.onload = function loadTabs() {
  console.log("hello");
  // Add language bars and inputs to problems
  var tabs = document.getElementById("tabContainer");
  for (problem in problems) {
    console.log(problem);
    // Add tab button 
    var btn = document.createElement("button");
    btn.classList.add("tabLink");
    btn.id = "btn" + problem;
    btn.innerHTML = problems[problem].title;
    var p = problems[problem];
    btn.onclick = (function(opt) {
      return function() {
        openTab(opt);
      };
    })(problem);
    tabs.appendChild(btn);   
    // Add language bar, input field and submit button
    var div = document.getElementById(problem);
    console.log(div);
    var lb = document.createElement("div");
    lb.classList.add("lb");
    lb.classList.add("apl");    
    var input = document.createElement("input");
    input.id = "s" + problem;
    input.classList.add("apl");
    input.classList.add("solution");
    var submit = document.createElement("button");
    submit.onclick = (function(opt) {
      return function() {
        sub(opt);
      }
    })(problem);
    submit.classList.add("submit");
    submit.innerHTML = "Submit";
    var feedback = document.createElement("div");
    feedback.id = "feedback" + problem;
    div.appendChild(lb);
    div.appendChild(input);
    div.appendChild(submit);
    div.appendChild(feedback);
  }
  var lbScript = document.createElement("script");
  lbScript.src = "lb.js";
  document.body.appendChild(lbScript)  
  openTab("P0");
}

function openTab(p) {
  console.log("ot");
  console.log(p);
  var i, tabs, tabLinks;
  // Get all elements with class="tab" and hide
  tabs = document.getElementsByClassName("tab");
  for (i = 0; i < tabs.length; i++) {
    console.log(tabs[i]);
    tabs[i].style.display = "none";
  }
  // Get all tabLinks and remove the "active" class
  tabLinks = document.getElementsByClassName("tabLink");
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove("active");
  }
  document.getElementById(p).style.display = "block";
  // Add active class to clicked button
  var btn = document.getElementById("btn" + p);
  console.log(btn);
  btn.classList.add("active");
}

function sub(p) {
  submit(p);  
}


