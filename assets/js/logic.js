//$(()=>{
const hintEl = $("#hint");
const questionNoEl = $("#q-number");
const questAnsEl = $("#question-answer");
const prevBtnEl = $("#prev-btn");
const nextBtnEL = $("#next-btn");
let trackQ = -1;

let diffuculty = "easy"

addGlobalEventListener("click", nextBtn, "#next-btn");
function nextBtn() {
    trackQ++;
    trackQ = trackQ===questions[diffuculty].length ? trackQ-1 : trackQ;
    console.log(trackQ);
    changeText("#q-number", `${trackQ+1}/${questions[diffuculty].length}`)
    loadQuestion(diffuculty);
}

addGlobalEventListener("click", prevBtn, "#prev-btn");
function prevBtn() {
    trackQ--;
    if(trackQ<0){
        trackQ = 0;
        return;
    }
    console.log(trackQ);
    changeText("#q-number", `${trackQ+1}/${questions[diffuculty].length}`)
    loadQuestion(diffuculty);
}

function loadQuestion(level){
    const temp=questions[level][trackQ].question;
    console.log(temp)
    changeText("#question-answer", temp)
    //changeText("#question-answer", "TEST")
}
//});