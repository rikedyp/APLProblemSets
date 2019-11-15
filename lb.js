;(_=>{
let hc={'<':'&lt;','&':'&amp;',"'":'&apos;','"':'&quot;',"\n":"<br/>"},he=x=>x.replace(/[<&'"\n]/g,c=>hc[c]) //html chars and escape fn
,tcs='<-←xx×/\\×:-÷*O⍟[-⌹-]⌹OO○77⌈FF⌈ll⌊LL⌊T_⌶II⌶|_⊥TT⊤-|⊣|-⊢=/≠L-≠<=≤<_≤>=≥>_≥==≡=_≡7=≢L=≢vv∨^^∧^~⍲v~⍱^|↑v|↓((⊂cc⊂(_⊆c_⊆))⊃[|⌷|]⌷A|⍋V|⍒ii⍳i_⍸ee∊e_⍷'+
'uu∪UU∪nn∩/-⌿\\-⍀,-⍪rr⍴pp⍴O|⌽O-⊖O\\⍉""¨~"⍨*"⍣oo∘o"⍤[\'⍞\']⍞[]⎕[:⍠:]⍠[=⌸=]⌸[<⌺>]⌺o_⍎oT⍕o-⍕<>⋄^v⋄on⍝->→aa⍺ww⍵VV∇--¯0~⍬'+
'^-∆^=⍙[?⍰?]⍰:V⍢∇"⍢||∥ox¤)_⊇_)⊇O:⍥O"⍥V~⍫\'\'`'+'-({)-}|([)|]'
,lbs=['←←\nASSIGN',' ','++\nconjugate\nplus','--\nnegate\nminus','××\ndirection\ntimes','÷÷\nreciprocal\ndivide','**\nexponential\npower','⍟⍟\nnatural logarithm\nlogarithm',
'⌹⌹\nmatrix inverse\nmatrix divide','○○\npi times\ncircular','!!\nfactorial\nbinomial','??\nroll\ndeal',' ','||\nmagnitude\nresidue',
'⌈⌈\nceiling\nmaximum','⌊⌊\nfloor\nminimum','⊥⊥\ndecode','⊤⊤\nencode','⊣⊣\nsame\nleft','⊢⊢\nsame\nright',' ','==\nequal','≠≠\nnot equal',
'≤≤\nless than or equal to','<<\nless than','>>\ngreater than','≥≥\ngreater than or equal to','≡≡\ndepth\nmatch','≢≢\ntally\nnot match',' ','∨∨\ngreatest common divisor/or',
'∧∧\nlowest common multiple/and','⍲⍲\nnand','⍱⍱\nnor',' ','↑↑\nmix\ntake','↓↓\nsplit\ndrop','⊂⊂\nenclose\npartioned enclose','⊃⊃\nfirst\npick','⊆⊆\nnest\npartition\n','⌷⌷\nindex','⍋⍋\ngrade up\ngrade up',
'⍒⍒\ngrade down\ngrade down',' ','⍳⍳\nindices\nindices of','⍸⍸\nwhere\ninterval index','∊∊\nenlist\nmember of','⍷⍷\nfind','∪∪\nunique\nunion','∩∩\nintersection','~~\nnot\nwithout',' ',
'//\nreplicate\nReduce','\\\\\n\expand\nScan','⌿⌿\nreplicate first\nReduce First','⍀⍀\nexpand first\nScan First',' ',',,\nenlist\ncatenate/laminate',
'⍪⍪\ntable\ncatenate first/laminate','⍴⍴\nshape\nreshape','⌽⌽\nreverse\nrotate','⊖⊖\nreverse first\nrotate first',
'⍉⍉\ntranspose\nreorder axes',' ','¨¨\nEach','⍨⍨\nSelfie\nSwap','⍣⍣\nRepeat','..\nOuter Product (<span class="APL">∘.</span>)\nInner Product',
'∘∘\nOUTER PRODUCT (<span class="APL">∘.</span>)\nCurry\nCompose','⍤⍤\nRank','@@\nAt',' ',
'⌸⌸\nIndex Key\nKey\n','⌺⌺\nStencil','⍎⍎\nexecute','⍕⍕\nformat',' ','{{\nBEGIN DFN','⍺⍺\nLEFT ARGUMENT','⋄⋄\nSTATEMENT SEPARATOR','⍵⍵\nRIGHT ARGUMENT',
'}}\nEND DFN',' ','¯¯\nNEGATIVE','⍬⍬\nEMPTY NUMERIC VECTOR','[[\nbegin index\nBegin Axis',']]\nend index\nEnd Axis']
,bqk=' =1234567890-qwertyuiop\\asdfghjk∙l;\'zxcvbnm,./`[]+!@#$%^&*()_QWERTYUIOP|ASDFGHJKL:"ZXCVBNM<>?~{}'.replace(/∙/g,'')
,bqv='`÷¨¯<≤=≥>≠∨∧×?⍵∊⍴~↑↓⍳○*⊢∙⍺⌈⌊_∇∆∘\'⎕⍎⍕∙⊂⊃∩∪⊥⊤|⍝⍀⌿⋄←→⌹⌶⍫⍒⍋⌽⍉⊖⍟⍱⍲!⍰W⍷R⍨YU⍸⍥⍣⊣ASDF⍢H⍤⌸⌷≡≢⊆⊇CVB¤∥⍪⍙⍠⌺⍞⍬'.replace(/∙/g,'')
,tc={},bqc={} //tab completions and ` completions
for(let i=0;i<bqk.length;i++)bqc[bqk[i]]=bqv[i]
for(let i=0;i<tcs.length;i+=3)tc[tcs[i]+tcs[i+1]]=tcs[i+2]
for(let i=0;i<tcs.length;i+=3){let k=tcs[i+1]+tcs[i];tc[k]=tc[k]||tcs[i+2]}
let lbh='';for(let i=0;i<lbs.length;i++){
  let ks=[]
  for(let j=0;j<tcs.length;j+=3)if(lbs[i][0]===tcs[j+2])ks.push('\n'+'<kbd class="APL">'+tcs[j]+'</kbd><kbd class="APL">'+tcs[j+1]+'</kbd><kbd>Tab&nbsp;<i class="fas fa-exchange fa-flip-horizontal"></i></kbd>')
  for(let j=0;j<bqk.length;j++)if(lbs[i][0]===bqv[j])ks.push('\n<kbd class="APL">`</kbd><kbd class="APL">'+bqk[j]+'</kbd>')
  lbh+='<b ';
  if(lbs[i][0]!=' '){lbh+='class="ngn_tt"';
  lbh+=' title="'+he('<p class="ngn_tth">'+lbs[i][1]+"</p><span>"+lbs[i].slice(3)+"</span>"+(ks.length?ks.join(''):''))+'"';};
  lbh+='>'+lbs[i][0]+'</b>'
}
let d=document;
let lbcs = [...d.getElementsByClassName("lb")];
let bqm=0;
let pd=x=>x.preventDefault()
let ev=(x,t,f,c)=>x.addEventListener(t,f,c)
let fk=x=>{
  let t=x.target
  if(bqm){let i=t.selectionStart,v=t.value,c=bqc[x.key];console.log(x.which);if(x.which>31||x.which==8){bqm=0;lbcs.map(c => d.body.classList.remove('ngn_bq'));if(x.which==8)x.preventDefault()}
          if(c){t.value=v.slice(0,i)+c+v.slice(i);t.selectionStart=t.selectionEnd=i+1;pd(x);return!1}}
  if (!x.ctrlKey && !x.altKey && !x.metaKey) {
    if ("`§°²µº½ù".indexOf(x.key) > -1) {
      bqm=1;d.body.classList.add('ngn_bq');pd(x); // ` or other trigger symbol pressed, wait for next key
    } else if (x.key == "Tab") {
      let i=t.selectionStart,v=t.value,c=tc[v.slice(i-2,i)]
      if(c){t.value=v.slice(0,i-2)+c+v.slice(i);t.selectionStart=t.selectionEnd=i-1;pd(x)}
    }
  }
}
lbcs.forEach(lbc => { 
  let el=d.createElement('div');el.innerHTML=`<div class=ngn_lb>${lbh}</div>`
  lbc.appendChild(el)
  let t,ts=[],lb=el.firstChild //t:textarea or input, lb:language bar
  ev(lb,'mousedown',x=>{
    if(x.target.nodeName==='B'&&t){
      console.log(x.target);
      let i=t.selectionStart,j=t.selectionEnd,v=t.value,s=x.target.textContent
      if(i!=null&&j!=null){t.value=v.slice(0,i)+s+v.slice(j);t.selectionStart=t.selectionEnd=i+s.length}
      pd(x);return
    }
  })
  let ff=x=>{
    let t0=x.target,nn=t0.nodeName.toLowerCase()
    if(nn!=='textarea'&&(nn!=='input'||t0.type!=='text'&&t0.type!=='search'))return;
    if(!t0.classList.contains("solution"))return;
    t=t0;if(!t.ngn){t.ngn=1;ts.push(t);ev(t,'keydown',fk)}
  }
  ev(d,'focus',ff,!0);let ae=d.activeElement;ae&&ff({type:'focus',target:ae})
});
})();
