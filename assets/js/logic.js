// question number tracker
let trackQ = -1;

// add logic to difficulty() for selecting the difficulty options at start of game
let difficulty = ()=> "advanced"

addGlobalEventListener("click", ".next-btn", nextBtn);
addGlobalEventListener("click", ".prev-btn", prevBtn);
addGlobalEventListener("click", "#q-hint", loadHint);

function nextBtn() {
    trackQ++;
    if(trackQ===questions[difficulty()].length) {
        trackQ = questions[difficulty()].length-1;
        endScreen(); 
        return
    }
    trackQ = trackQ===questions[difficulty()].length ? trackQ-1 : trackQ;
    console.log(trackQ);
    if(!trackQ)Timer.start();
    loadQuestion();
}

function prevBtn() {
    if(trackQ>0)trackQ--;
    if(trackQ<0){
        console.log("Can't park there, mate!")
        trackQ = -1;
        return;
    }
    console.log(trackQ);
    loadQuestion();
}

function loadQuestion(level=difficulty(), questionNo=trackQ){
    changeText("#footer-msg", "msg");
    changeText("#q-number", `${questionNo+1}/${questions[level].length}`);
    // set initial time for question
    Timer.setTime(30);
    const q=questions[level][questionNo].question;
    console.log(q);
    changeText("#question-answer", q);
}

function loadAnswers(){
    const answersList = document.querySelectorAll("#q-answers");

}

function loadHint(level=difficulty()){
    const h=questions[level][trackQ].hint;
    changeText("#footer-msg", h);
    Timer.deductTime(10);
}

function endScreen(){
    console.log("THE END!!")
}