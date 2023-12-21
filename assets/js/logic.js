Timer.setTime(30);
let trackQ = -1;

// add logic to difficulty() for selecting the difficulty options at start of game
let difficulty = ()=> "easy"

//addGlobalEventListener("click", playBtn, ".play-btn");
addGlobalEventListener("click", ".next-btn", nextBtn);
addGlobalEventListener("click", ".prev-btn", prevBtn);
addGlobalEventListener("click", "#q-hint", loadHint);


function nextBtn() {
    trackQ++;
    trackQ = trackQ===questions[difficulty()].length ? trackQ-1 : trackQ;
    console.log(trackQ);
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
    changeText("#q-hint", "Hint");
    changeText("#q-number", `${questionNo+1}/${questions[level].length}`);
    const q=questions[level][questionNo].question;
    console.log(q);
    changeText("#question-answer", q);
}

function loadHint(level=difficulty()){
    const h=questions[level][trackQ].hint;
    changeText("#q-hint", h);
    Timer.deductTime(10);
}

function endScreen(){
    console.log("THE END!!")
}