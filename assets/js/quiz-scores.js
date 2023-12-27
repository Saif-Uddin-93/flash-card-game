// SU: Suggested method for getting highscores
// SU: Not yet finished.
const highscoreElement = htmlElement('#highscores');
let names = Object.keys(localStorage);



names = names.filter((element, index) => element.includes("score:"))
let namesIndecies = names.map((element, index) =>  index);



let scores = Object.values(localStorage);

const combinedArray = scores.map((element, index) => ({ element, index })).sort((a, b) => b.element - a.element);

scores = combinedArray.map(obj => scores[obj.index]);
names = combinedArray.map(obj => names[obj.index]);

let scoreList='';
for (let i = 0; i<names.length; i++) scoreList += `<li>${names[i]} - ${scores[i]}</li>`;

highscoreElement.innerHTML = scoreList; 

function clearScore(){
    localStorage.clear();
    highscoreElement.innerHTML='';
}