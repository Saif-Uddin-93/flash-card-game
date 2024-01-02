// SU: Suggested method for getting highscores
const htmlElement = (selector) => document.querySelector(selector);
document.addEventListener('DOMContentLoaded', function () {
    const loadTheme = localStorage.getItem("theme")===null ? "light" : localStorage.getItem("theme");
    htmlElement("html").setAttribute("data-theme",loadTheme);
 });
const highscoreElement = htmlElement('#highscores');
let highScore;
if(localStorage.getItem("q-highScore")===null){
    console.log("HIGHSCORE EMPTY!!!")
    highScore = {};
}else{
    console.log(localStorage.getItem("q-highScore"));
    highScore = JSON.parse(localStorage.getItem("q-highScore"));
}

let names = Object.keys(highScore);

let scores = Object.values(highScore);

const combinedArray = scores.map((element, index) => ({ element, index })).sort((a, b) => b.element - a.element);

scores = combinedArray.map(obj => scores[obj.index]);
names = combinedArray.map(obj => names[obj.index]);

let scoreList='';
for (let i = 0; i<names.length; i++) scoreList += `<li>${names[i]} - ${scores[i]}</li>`;

highscoreElement.innerHTML = scoreList; 

/* function clearScore(){
    localStorage.setItem("q-highScore", "");
    highscoreElement.innerHTML='';
} */