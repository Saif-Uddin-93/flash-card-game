addGlobalEventListener("click", ".next-btn", nextBtn);
//addGlobalEventListener("click", ".prev-btn", prevBtn);
addGlobalEventListener("click", "#q-hint", loadMsg);
addGlobalEventListener("click", ".options", checkAnswer)
addGlobalEventListener("click", "#clear-storage", settings.clearLocal)
addGlobalEventListener("click", ".q-settings", settings.loadSettings)
addGlobalEventListener("click", "#save-settings", settings.save)
addGlobalEventListener("click", ".close-settings", settings.loadSettings)
addGlobalEventListener("click", ".mode-btn", scroll)

// --------- >API> ---------
const difficulty = (lvl) => lvl||"easy";
let apiResult = {};
function callAPI(level, amount){
    const questionAmount = amount;
    const category = 18;// 18 is computer science
    difficulty(level);
    //const qType = "multiple";// qType must not change
    
    const apiURL = `https://opentdb.com/api.php?amount=${questionAmount}&category=${category}&difficulty=${level||"easy"}&type=multiple`//${qType}`
    
    fetch(apiURL)
    .then(response => response.json())
    .then(result => apiResult = result)
    //.catch(console.log(`need to wait 5 seconds before loading new quiz`))
}
// --------- <API< ---------

// question number tracker
let trackQ = -1;
// points tracker
let points = 0;

function scroll(){
    window.scrollBy({
        top: 100,
        behavior: "smooth",
    });
}

function nextBtn() {
    if(trackQ===-1)cssStyle("#q-answers", "display", "flex");
    trackQ++;
    if(trackQ===apiResult.results.length)
    {
        trackQ = apiResult.results.length-1;
        endScreen(); 
        return;
    }
    trackQ = trackQ===apiResult.results.length ? trackQ-1 : trackQ;
    console.log(trackQ);
    if(!trackQ)Timer.start();
    //clearAnswers();
    /* if(trackQ>0)Timer.timeoutSet(loadQuestion, 2)
    else  */loadQuestion();
    showProgress();
}

function showProgress(bars = trackQ+1){
    const bar = $(".progress");
    bar.css("display", "block");
    bar.css("width", `${(100/apiResult.results.length)*bars}%`);
    bar.css("height", `100%`);
    bar.css("background-color", `aquamarine`);
}

/* function prevBtn() {
    if(trackQ>0)trackQ--;
    if(trackQ<0){
        console.log("No questions that way!")
        trackQ = -1;
        return;
    }
    console.log(trackQ);
    //clearAnswers();
    loadQuestion();
    // Timer.timeoutSet(loadQuestion, 2);
} */

function loadQuestion(level=difficulty(), questionNo=trackQ+1){
    cssStyle("#footer-msg","visibility","hidden")
    changeText("#q-number", `${questionNo}/${apiResult.results.length/* questions[level].length */}`);
    // set initial time for question
    Timer.setTime(30);
    const q=apiResult.results[questionNo].question;//questions[level][questionNo].question;
    console.log(q);
    changeText("#q-a", q);
    //clearAnswers();
    loadAnswers();
}

function loadAnswers(level=difficulty(), questionNo=trackQ){
    const listWrong = apiResult.results[questionNo].incorrect_answers
    const answerCorrect=apiResult.results[questionNo].correct_answer;//questions[level][questionNo].answer;
    const answersList = document.getElementsByClassName("options");
    console.log(decodeHTML(answerCorrect), listWrong)
    answersList[0].classList.remove("visible");
    answersList[0].classList.add("visible");
    loop();
    function loop (i=0, usedIndecies=[], newIndex=0, delay=0.1)
    {
        do newIndex = Math.floor(Math.random()*answersList.length)
        while(usedIndecies.includes(newIndex))
        usedIndecies.push(newIndex);
        answersList[newIndex].innerHTML=decodeHTML(listWrong[i]);
        answersList[i||1].classList.remove("visible");
        Timer.timeoutSet(()=>{
            i=i>3?3:i;
            answersList[i||1].classList.add("visible");
        }, (i||1)*delay)
        i++;
        if(i<answersList.length)loop(i, usedIndecies);
        if(i===answersList.length)answersList[newIndex].innerHTML=decodeHTML(answerCorrect);
    }
}

function checkAnswer(eventObj){
    Timer.timeoutClr();
    const toDisable = Array.from(document.getElementsByClassName("btn-check"));
    toDisable.forEach(element => {
        element.disabled=true;
    });
    htmlElement(`#next-btn`).disabled=true;
    const targetText = eventObj.target.innerHTML;
    const answer = apiResult.results[trackQ].correct_answer;
    const msg = targetText===answer ? "Correct!" : "Wrong!";
    points = msg==="Correct!" ? points+1 : points;
    points = points>$("#mode-number").val() ? $("#mode-number").val() : points;
    $("#q-points").text(`Score: ${points}`);
    const css = msg==="Correct!" ? "correct" : "incorrect";
    if(msg==="Correct!"){
        if(settings.sfxElement.checked)soundsLibrary.play().correct();
    }else{
        if(settings.sfxElement.checked)soundsLibrary.play().incorrect();
    }
    //console.log(targetText, answer, msg, css);
    cssClass("#footer-msg", "add", css);
    eventObj.target.classList.add(css);
    loadMsg(msg);
    Timer.timeoutSet(()=>{
        cssClass("#footer-msg", "remove", css);
        eventObj.target.classList.remove(css);
        toDisable.forEach(element => {
            element.disabled=false;
        });
        htmlElement(`#next-btn`).disabled=false;
    }, 2);
    Timer.timeoutSet(nextBtn, 2);
}

function loadMsg(msg, hint=false){
    msg = (typeof msg)!=="string" ? "MESSAGE!" : msg;
    changeText("#footer-msg", msg);
    cssStyle("#footer-msg","visibility","visible");
    if(hint)Timer.deductTime(10);
}

function qTooltip (focus=true) {
    if (focus) cssStyle(".q-tip", "visibility", "visible");
    else cssStyle(".q-tip", "visibility", "hidden");
}

function endScreen(){
    Timer.stop();
    Timer.setTime(0);
    console.log("THE END!!");
    //location.href = "highscores.html";
}

/* function clearAnswers(){
    const answersList = document.getElementsByClassName("visible");   
    //console.log("CLEAR ANSWERS", answersList)
    for (let index = 0; index < answersList.length; index++) {
        //answersList[index].style.opacity=0;
        console.log(answersList[index], "remove visible")
        //answersList[index].style.opacity = 0;
        answersList[index].classList.remove("visible");
        answersList[index].classList.remove("hide");
    }
} */