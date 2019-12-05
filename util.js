function clipCopy(ID) {
  var copyText = document.getElementById(ID);
  copyText.select();
  copyText.setSelectionRange(0,99999);
  document.execCommand("copy");
  alert("Copied");
}

function Hello() {
  console.log("it works");
}