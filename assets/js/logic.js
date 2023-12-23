// question number tracker
let trackQ = -1;

addGlobalEventListener("click", ".next-btn", nextBtn);
addGlobalEventListener("click", ".prev-btn", prevBtn);
//addGlobalEventListener("click", "#q-hint", loadHint);

function nextBtn() {
    trackQ++;
    if(trackQ===apiResult["results"].length)//questions[difficulty()].length) 
    {
        trackQ = apiResult["results"].length-1;//questions[difficulty()].length-1;
        endScreen(); 
        return;
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
    cssStyle("#footer-msg","visibility","hidden")
    changeText("#q-number", `${questionNo+1}/${apiResult["results"].length/* questions[level].length */}`);
    // set initial time for question
    Timer.setTime(30);
    const q=apiResult["results"][questionNo]["question"];//questions[level][questionNo].question;
    console.log(q);
    changeText("#q-a", q);
    loadAnswers();
}

function loadAnswers(level=difficulty(), questionNo=trackQ){
    const answersList = document.getElementsByClassName("options");
    const answerCorrect=apiResult["results"][questionNo]["correct_answer"];//questions[level][questionNo].answer;
    const listWrong = apiResult["results"][questionNo]["incorrect_answers"]
    console.log(answersList, answerCorrect, listWrong)
    loop(0);
    function loop (i=0, usedIndecies=[], newIndex=0)
    {
        do newIndex = Math.floor(Math.random()*answersList.length)
        while(usedIndecies.includes(newIndex))
        usedIndecies.push(newIndex);
        answersList[newIndex].textContent=listWrong[i];
        i++;
        if(i<answersList.length)loop(i, usedIndecies);
        if(i===answersList.length)answersList[newIndex].textContent=answerCorrect;
    }
}

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