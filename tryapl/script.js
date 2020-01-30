// tryapl.org
var version = 3.0;
var currentBook;
var currentCell = 0;
var splitPanes;
var paneSizes = [40, 60];
var fs = false;

$=s=>document.querySelector(s);
$$=s=>document.querySelectorAll(s);

window.MathJax = {
  tex: {
    inlineMath: [["$", "$"]]
  }
};

window.onload=_=>{
  log("TryAPL v." + version);
  splitPanes = Split(["#leftPane", "#rightPane"], {
    sizes: [40, 60],
    minSize: [0,250]
  })    
  loadTioDyalog();
  $(".gutter").innerHTML += "<span id='full' onclick='sessionFS()'>◀</span>";
  hi.classList.add("active");
  hiTab.classList.add("active");
}

showTab=id=>{
  $$(".content").forEach(fn=tab=>{    
    if (id != tab.id) {      
      $("#" + tab.id + "Tab").classList.remove("active");
      tab.classList.remove("active");
    } else {
      tab.classList.add("active");
      $("#" + tab.id + "Tab").classList.add("active");
    }
  })
}

sessionFS=_=>{  
  if (fs) {    
    // session spit screen
    splitPanes.setSizes(paneSizes);
    full.innerHTML = "◀"; // Left triangle     
  } else {
    // session full screen 
    paneSizes = splitPanes.getSizes();
    splitPanes.setSizes([0,100]);    
    $("#full").innerHTML = "▶"; // Right triangle    
  }  
  fs = !fs;
}

nbnext=_=>{
  log("next");
  cell = currentBook.cells[currentCell]
  log(cell);
  switch (cell.cell_type) {
    case "code":
      session.value += cell.source;
      putCursor(session.value.length);
      submitLine();
    default:
      mdrender.innerHTML += marked(cell.source[0]) + " <br>";
      MathJax.texReset();
      MathJax.typesetClear();
      MathJax.typeset(["#mdrender"]);      
  }
  currentCell += 1;
}

clickAPL=code=>{
  log("clicked APL code");
}

nbload=id=> {
  url = $(id).value;
  log("running notebook @:" + url);  
  fetch(nburl(url)).then((response)=>{
    return response.json();
  }).then((json)=>{   
    currentBook = json;      
  })
}

nburl=url=> {
  log(url);
  if (url.includes("github") && !url.includes("raw.githubusercontent")) {
    log("https://raw.githubusercontent.com" + url.split("https://github.com")[1].split("/blob").join(""));
    return "https://raw.githubusercontent.com" + url.split("https://github.com")[1].split("/blob").join("");
  }
}