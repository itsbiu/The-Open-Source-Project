const text = "Bienvenido al Proyecto";
let index = 0;

function typeEffect() {

  if(index < text.length){
    document.getElementById("title").innerHTML += text.charAt(index);
    index++;
    setTimeout(typeEffect,70);
  }

}

typeEffect();

function enterSite(){
  window.location.href="home.html";
}
