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
  gutter.innerHTML += "<span id='full' accesskey='z' onclick='leftPane.style.transition = \"width 0.15s\";sessionFS();'><svg width='8' height='16' id='triangle'><polygon points='0,8 8,16 8,0'/></svg></span>";
  hi.classList.add("active");
  hiTab.classList.add("active"); 
  $$("code.apl").forEach(fn=el=>{el.onclick=e=>{replaceLine(e.target.innerHTML)}});  
  var s=new URLSearchParams(location.search) // Options from URL 
  // Go to tab from URL  
  if (expr = s.get("tab")) {showTab(expr);}  
  // Open notebook from URL
  if (expr = s.get("notebook")) {showTab("learn");nbURL.value=expr;nbLoad("#nbURL")};
  fetch("assets/elements.h").then(e=>e.text()).then(e=>{
    symbols=""
    elements=e.split("NAME(").slice(1).map(t=>{
      lines=[...t.matchAll(/"[^"]*"/g)];
      symbols+=lines[1][0][1];
      return lines.join("\n").replace(/"/g,'').replace(/\\\\/g,"\\")
    })
  })
}

paneDrag=s=>{
  if (1 > splitPanes.getSizes()[0]) {
    fs = true;
    triangle.classList.add("flip");
  } else {
    fs = false;
    triangle.classList.remove("flip");
  }  
  leftPane.style.transition = "unset";
}

showTab=id=>{
  contents=[...$$(".content")]
  id=(i=parseInt(id))?[...contents].map(n=>n.id)[(i-1)/2]:id.toLowerCase();
  contents.forEach(fn=tab=>{    
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

insertLine=async code=>{
  session.value += code;
  putCursor(session.value.length); 
  session.focus(); 
  return new Promise(function (resolve, reject) {
    resolve(0);
  });
}

glyphHelp=g=>{
  session.value += "\n"+"─".repeat(80)+"\n"+elements[symbols.search("\\"+g)]+"      ";
  lastText=session.value;
  putCursor(session.value.length);
  session.focus(); 
}

replaceLine=code=>{  
  replaceCurrentLine("      " + code); // from tio-dyalog.js   
  session.focus();
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

replaceAll=(str, find, replace)=>{return str.replace(new RegExp(find, 'g'), replace)}

nbNext=async dir=>{
  // Render (∧,∨) execute next ∨ previous cell  
  mdrender.style.display = "block";
  newCell = currentBook.cells[currentCell]
  log(newCell);
  if (dir) {
    log("next cell");
    cellSource = newCell.source;
    log(newCell.cell_type);
    switch (newCell.cell_type) {      
      case "code":
        // todo, jupyter dinput        
        var firstChar = cellSource[0].replace(/\s/g, '')[0];
        if (firstChar === "∇" || firstChar === "]") {
          log("tradfn or ]dinput here")
          // Submit whole definition
          if (cellSource[0].replace(/\s/g, '') === "]dinput") {
            //dfn            
            fnDef = replaceAll(cellSource.slice(1,cellSource.length).join(""), "\n", "") + "\n".repeat(cellSource.length - 1);
          } else {
            // tradfn
            fnDef = cellSource.join("");
          }          
          submitLine(fnDef, tioParams).then(fn=>{
            // Format definition with line numbers [1]
            for (let i = 1; i < cellSource.length; i++) {
              log("----------");
              log(cellSource[i]);
              cellSource[i] = "[" + i + "]" + "&nbsp;&nbsp;" + cellSource[i];
            }
            newLine = cellSource.join("");            
            var div = document.createElement("div");
            div.innerHTML = "<pre class=\"apl\">" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + newLine + "</code>";
            mdrender.append(div);
            // Replace session appendage from submitLine
            session.value = session.value.split("\n").slice(0,-cellSource.length-1).join("\n") + "\n      ";
            insertLine(replaceAll(newLine + "\n      ", "&nbsp;", " ")) 
          });
        } else {
          log("ONE LINER");
          lastText = session.value;
          for (let line of cellSource) {
            newLine = line.replace("\n", "");
            insertLine(newLine).then(fn=>{
              var div = document.createElement("div");
              div.innerHTML = "<code class=\"apl\">" + "&nbsp;&nbsp;" + newLine + "</code>";
              mdrender.append(div);
            }).then(await submitLine("      " + newLine, tioParams));
          }   
        }          
        break;
      case "markdown":                
        log(cellSource);        
        for (var i = 0; i < cellSource.length; i++) {          
          line = cellSource[i];
          if (0 < line.search(/src=\S+/) && 0 > line.search(/src=\"http\S+/)) {                                   
            src = cleanURL(nbURL.value);
            imgURL = src.slice(0,src.lastIndexOf("/") + 1) + line.match(/src=\S+/)[0].slice(5,-1);                        
            cellSource[i] = line.replace(/src=\S+/, "src=\"" + imgURL + "\"");
            // todo: handle multiple images in one line 
            // todo: store cleanURL(nbURL) on Run for use here 
            // todo: what about 
            // Make sure images use absolute URLs
            // todo: What about e.g. <script src="">?
          } else {            
            log("No relative image URL to make absolute");
          }
        }        
      case undefined:
        log("woah");        
      default:        
        var div = document.createElement("div");        
        cellSource.forEach(fn=line=>{div.innerHTML += marked(line)});        
        mdrender.appendChild(div);        
        MathJax.texReset();
        MathJax.typesetClear();
        MathJax.typeset(["#mdrender"]);      
    }
    currentCell += 1;        
    // Calculate mdrender height to set scrollTop 
    mdh = 0; // mdrender height
    Array.from(mdrender.children).forEach(fn=el=>{mdh += el.clientHeight;});
    log("MDR height: " + String(mdh));
    mdrender.scrollTop = mdh;
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