// question number tracker
let trackQ = -1;

// add logic to difficulty() for selecting the difficulty options at start of game
let difficulty = ()=> "easy"

addGlobalEventListener("click", ".next-btn", nextBtn);
addGlobalEventListener("click", ".prev-btn", prevBtn);
//addGlobalEventListener("click", "#q-hint", loadHint);

function nextBtn() {
    trackQ++;
    if(trackQ===apiResult["results"].length)//questions[difficulty()].length) 
    {
        trackQ = apiResult["results"].length-1;//questions[difficulty()].length-1;
        endScreen(); 
        return
    }
    trackQ = trackQ===apiResult["results"].length /* questions[difficulty()].length */ ? trackQ-1 : trackQ;
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
    //changeText("#footer-msg", "msg");
    cssStyle("#footer-msg","visibility","hidden")
    changeText("#q-number", `${questionNo+1}/${apiResult["results"].length/* questions[level].length */}`);
    // set initial time for question
    Timer.setTime(30);
    const q=apiResult["results"][questionNo]["question"];//questions[level][questionNo].question;
    console.log(q);
    changeText("#q-a", q);
    //loadAnswers();
}

/* function loadAnswers(level=difficulty(), questionNo=trackQ){
    const answersList = document.querySelector("#q-answers");

    const a=questions[level][questionNo].answer;
    console.log(answersList, a)
} */

/* function loadHint(level=difficulty()){
    const h=questions[level][trackQ].hint;
    changeText("#footer-msg", h);
    cssStyle("#footer-msg","visibility","visible")
    //cssClass("#footer-msg", "toggle", "card-footer")
    Timer.deductTime(10);
} */

function endScreen(){
    console.log("THE END!!")
}