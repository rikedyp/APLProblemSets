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
    minSize: [0,250],
    onDrag: paneDrag
  })    
  loadTioDyalog();
  gutter = $(".gutter");  
  gutter.innerHTML += "<span id='full' onmousedown='leftPane.style.transition = \"width 0.15s\";sessionFS();'><svg width='8' height='16' id='triangle'><polygon points='0,8 8,16 8,0'/></svg></span>";
  hi.classList.add("active");
  hiTab.classList.add("active"); 
  $$("code.apl").forEach(fn=el=>{
    el.onclick = clickAPL;
    console.log(el);
  });
}

paneDrag=s=>{
  if (1 > splitPanes.getSizes()[0]) {
    fs = true;
    triangle.classList.add("flip");
  } else {
    fs = false;
    triangle.classList.remove("flip");
  }
  log(splitPanes.getSizes());
  leftPane.style.transition = "unset";
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
    // session split screen
    triangle.classList.remove("flip");
    splitPanes.setSizes(paneSizes);       
  } else {
    // session full screen     
    triangle.classList.add("flip")
    paneSizes = splitPanes.getSizes();
    splitPanes.setSizes([0,100]);    
  }  
  fs = !fs;  
}

clickAPL=code=>{
  log("clicked APL code " + code.target.innerHTML);
  // session.value += code.target.innerHTML;
  replaceCurrentLine("      " + code.target.innerHTML);
  putCursor(session.value.length);
}

nbLoad=id=> {
  url = $(id).value;
  log("running notebook @:" + url);  
  fetch(cleanURL(url)).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Error loading notebook");
    }
  })    
  .then((json) => {   
    currentBook = json;  
    learnButtons.classList.remove("hidden");
    loadnb.classList.add ("hidden");
    nbNext(1);
  })
  .catch((err) => {
    log("the bad bad");
    log(err);
    mdrender.innerHTML = "Error loading notebook";
  });  
}

nbNext=dir=>{
  // Render (∧,∨) execute next ∨ previous cell
  log("next");
  mdrender.style.display = "block";
  cell = currentBook.cells[currentCell]
  log(cell);
  if (dir) {
    log("next cell");
    switch (cell.cell_type) {
      case "code":
        session.value += cell.source;
        putCursor(session.value.length);
        submitLine();
      default:        
        var div = document.createElement("div");
        div.innerHTML += marked(cell.source[0]);
        mdrender.appendChild(div);        
        MathJax.texReset();
        MathJax.typesetClear();
        MathJax.typeset(["#mdrender"]);      
    }
    currentCell += 1;
    learn.scrollTop = mdrender.clientHeight;
  } else {
    log("previous cell");
    currentCell -= 1;
    mdrender.removeChild(mdrender.lastChild);
  }
}

nbReload=_=>{
  mdrender.innerHTML = "";
  currentCell = 0;
  nbNext(1);    
}

nbClose=_=>{
  log("close");
  learnButtons.classList.add("hidden");
  loadnb.classList.remove("hidden");
  mdrender.style.display = "none";
  mdrender.innerHTML = "";
  currentCell = 0;
}

cleanURL=url=>{
  log(url);
  if (url.includes("github") && !url.includes("raw.githubusercontent")) {
    log("https://raw.githubusercontent.com" + url.split("https://github.com")[1].split("/blob").join(""));
    return "https://raw.githubusercontent.com" + url.split("https://github.com")[1].split("/blob").join("");
  }
}