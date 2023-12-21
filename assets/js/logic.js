/* const hintEl = $("#hint");
const questionNoEl = $("#q-number");
const questAnsEl = $("#question-answer");
const prevBtnEl = $("#prev-btn");
const nextBtnEL = $("#next-btn"); */
let trackQ = -1;

let difficulty = ()=> "easy"

addGlobalEventListener("click", nextBtn, ".next-btn");
function nextBtn() {
    trackQ++;
    trackQ = trackQ===questions[difficulty()].length ? trackQ-1 : trackQ;
    console.log(trackQ);
    changeText("#q-number", `${trackQ+1}/${questions[difficulty()].length}`);
    loadQuestion(difficulty());
}

addGlobalEventListener("click", prevBtn, ".prev-btn");
function prevBtn() {
    if(trackQ>0)trackQ--;
    if(trackQ<0){
        console.log("HELLO!!")
        trackQ = -1;
        return;
    }
    console.log(trackQ);
    loadQuestion(difficulty());
}

function loadQuestion(level, questionNo=trackQ){
    changeText("#q-number", `${questionNo+1}/${questions[level].length}`);
    const q=questions[level][questionNo].question;
    console.log(q);
    changeText("#question-answer", q);
    //loadHint(level);
}

function loadHint(level){
    const h=questions[level][trackQ].hint;
    changeText("#hint", h);
}