const difficulty = (lvl) => lvl||"easy";
let apiResult = {};
function callAPI(level, amount){
    const questionAmount = amount;
    const category = 18;
    difficulty(level);
    
    //const qType = "multiple";// qType must not change

    const apiURL = `https://opentdb.com/api.php?amount=${questionAmount}&category=${category}&difficulty=${level||"easy"}&type=multiple`//${qType}`

    fetch(apiURL)
    .then(response => response.json())
    .then(result => apiResult = result)
    //.catch(console.log(`need to wait 5 seconds before loading new quiz`))
}


// question number tracker
let trackQ = -1;
let points = 0;

addGlobalEventListener("click", ".next-btn", nextBtn);
addGlobalEventListener("click", ".prev-btn", prevBtn);
addGlobalEventListener("click", "#q-hint", loadMsg);
addGlobalEventListener("click", ".options", checkAnswer)

function nextBtn() {
    trackQ++;
    if(trackQ===apiResult.results.length)//questions[difficulty()].length) 
    {
        trackQ = apiResult.results.length-1;//questions[difficulty()].length-1;
        endScreen(); 
        return;
    }
    trackQ = trackQ===apiResult.results.length /* questions[difficulty()].length */ ? trackQ-1 : trackQ;
    console.log(trackQ);
    if(!trackQ)Timer.start();
    loadQuestion();
}

function prevBtn() {
    if(trackQ>0)trackQ--;
    if(trackQ<0){
        console.log("No questions that way!")
        trackQ = -1;
        return;
    }
    console.log(trackQ);
    loadQuestion();
}

function loadQuestion(level=difficulty(), questionNo=trackQ){
    cssStyle("#footer-msg","visibility","hidden")
    changeText("#q-number", `${questionNo+1}/${apiResult.results.length/* questions[level].length */}`);
    // set initial time for question
    Timer.setTime(30);
    const q=apiResult.results[questionNo].question;//questions[level][questionNo].question;
    console.log(q);
    changeText("#q-a", q);
    loadAnswers();
}

function loadAnswers(level=difficulty(), questionNo=trackQ){
    const listWrong = apiResult.results[questionNo].incorrect_answers
    const answerCorrect=decodeHTML(apiResult.results[questionNo].correct_answer);//questions[level][questionNo].answer;
    const answersList = document.getElementsByClassName("options");
    console.log(answersList, answerCorrect, listWrong)
    answersList[0].classList.add("visible");
    loop();
    function loop (i=0, usedIndecies=[], newIndex=0, delay=0.5)
    {
        do newIndex = Math.floor(Math.random()*answersList.length)
        while(usedIndecies.includes(newIndex))
        usedIndecies.push(newIndex);
        answersList[newIndex].innerHTML=decodeHTML(listWrong[i]);
        Timer.timeoutSet(()=>{
            answersList[i].classList.add("visible");
        }, (i+1)*delay)
        i++;
        if(i<answersList.length)loop(i, usedIndecies);
        if(i===answersList.length)answersList[newIndex].innerHTML=decodeHTML(answerCorrect);
    }
}

function checkAnswer(eventObj){
    if(eventObj.target.textContent===decodeHTML(apiResult.results[trackQ].correct_answer)){
        points++;
        $("#q-points").text(`points ${points}`);
        loadMsg("Correct!", false);
        soundsLibrary.play().correct();
        Timer.timeoutSet(nextBtn, 2);
    }else{
        loadMsg("Wrong!", false);
        soundsLibrary.play().incorrect();
        Timer.timeoutSet(nextBtn, 2);
    }
    const answersList = document.querySelectorAll("options");
    answersList.forEach(element => {
        cssClass(element.id, "remove", "visible")
    });
}

function loadMsg(msg, hint=false){
    msg = (typeof msg)!=="string" ? "MESSAGE!" : msg
    changeText("#footer-msg", msg);
    cssStyle("#footer-msg","visibility","visible")
    if(hint)Timer.deductTime(10);
}

function endScreen(){
    console.log("THE END!!")
}