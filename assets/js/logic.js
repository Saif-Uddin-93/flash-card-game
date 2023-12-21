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
    changeText("#q-number", `${trackQ+1}/${questions[diffuculty].length}`);
    loadQuestion(diffuculty);
}

addGlobalEventListener("click", prevBtn, "#prev-btn");
function prevBtn() {
    if(trackQ>0)trackQ--;
    if(trackQ<0){
        trackQ = -1;
        return;
    }
    console.log(trackQ);
    changeText("#q-number", `${trackQ+1}/${questions[diffuculty].length}`);
    loadQuestion(diffuculty);
}

function loadQuestion(level){
    const q=questions[level][trackQ].question;
    console.log(q);
    changeText("#question-answer", q);
    const h=questions[level][trackQ].hint;
    changeText("#hint", h);
    //changeText("#question-answer", "TEST")
}
//});