// e.g htmlElement("#id")
// e.g htmlElement(".class")
// e.g htmlElement("tag")
const htmlElement = (id) => document.querySelector(id);

// e.g cssClass("#id", "add", "myClass")
// e.g cssClass(".class", "remove", "myClass")
// e.g cssClass("tag", "toggle", "myClass")
const cssClass = (selector="", action="", cssClass="", element=htmlElement(selector)) => {
  switch (action) {
    case "add":
      element.classList.add(cssClass);
      break;
    case "remove":
      element.classList.remove(cssClass);
      break;
    case "toggle":
      element.classList.toggle(cssClass);
      break;
    default:
      break;
  }
}

// e.g cssStyle("#footer-msg","visibility","hidden")
const cssStyle = (selector="", style="", value="") => htmlElement(selector).style[style] = value;
  
// e.g changeText("#id", "lorem ipso")
// e.g changeText(".class", "lorem ipso")
// e.g changeText("tag", "lorem ipso")
const changeText = (selector="", txt="", element=htmlElement(selector)) => element.textContent=txt;
//const changeText = (selector="", txt="", element=$(selector)) => element.text(txt);

// e.g addGlobalEventListener("click", "selector", nextQ)
function addGlobalEventListener(typeOfEvent="", selector="", callback, stopPropagation=true) {
  document.addEventListener(typeOfEvent, (eventObj) => {
    if (eventObj.target.matches(selector)) callback(eventObj);
    if (stopPropagation) eventObj.stopPropagation();
  })
}

// Timer object 
const timeElement = htmlElement("#q-timer")
const Timer = {
  timerInterval: undefined,
  timeoutInterval: undefined,
  timeoutSet: (callBack, ms=1)=> Timer.timeoutInterval = setTimeout(callBack, ms*1000),
  timeoutClr: ()=> clearTimeout(Timer.timeoutInterval),
  setActive : (bool = timeElement.dataset.active)=> timeElement.dataset.active = bool.toString(), 
  active : ()=> String(timeElement.dataset.active),
  setTime : (time = Timer.getTime())=> timeElement.textContent = `${time}s`,
  getTime : ()=> parseInt(timeElement.textContent),
  start : (ms=1000)=> {Timer.timerInterval = setInterval(Timer.countdown, ms); Timer.setActive(true)},
  stop : ()=> {clearInterval(Timer.timerInterval); Timer.setActive(false)},
  deductTime : (time)=> timeElement.textContent=Timer.getTime()-time<1 ? `${0}s` : `${Timer.getTime()-time}s`,
  countdown: ()=> {Timer.deductTime(1); if(Timer.getTime()<1) Timer.outOfTime();},
  outOfTime: ()=> {Timer.setTime(0); nextBtn()/* endScreen() */;},
}

// e.g soundVar("path/to/soundFile.wav")
const soundVar = (src="", audio=document.createElement("audio"), set=audio.setAttribute("src", src)) => audio
const correct = soundVar("assets/sfx/correct.wav");
const incorrect = soundVar("assets/sfx/incorrect.wav");
const soundsLibrary = {
  sounds: {
    correct : correct,
    incorrect : incorrect}, 
  stop : (s = Object.values(soundsLibrary.sounds)) => s.forEach(sound => {sound.pause(); sound.currentTime = 0;}),
  play : (stop = soundsLibrary.stop())=> ({
    correct : ()=> soundsLibrary.sounds.correct.play(),
    incorrect : ()=> soundsLibrary.sounds.incorrect.play(),}),
}

document.addEventListener('DOMContentLoaded', function () {
   // Trigger the Trivia Level Modal on page load
   //var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
   //myModal.show();
   
   const qSlider = htmlElement("#q-slider");
   qSlider.setAttribute("value", localStorage.getItem("q-font-size")||"48");
   $('#q-a').css("font-size", `${localStorage.getItem("q-font-size")||"48"}px`);
});

/* MT */
// slider for Q/A font size 
$("#q-slider").on("input", function () {
  $('#q-a').css("font-size", $(this).val() + "px");
  /* SU: storing font size to local storage */
  localStorage.setItem("q-font-size", $(this).val())
});

let questionsData = [];
// Initial fetch and display
let currentIndex = 0;

// Function to get questions
const getQuestions = (mode, number) => {
  if (questionsData.length > 0) {
    // If questionsData is already available, return it immediately
    return Promise.resolve(questionsData);
  }

  const url = `https://opentdb.com/api.php?amount=${number}&category=18&difficulty=${mode}&type=multiple`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      questionsData = data.results; // Store the fetched data
      return data; // Return the data so it can be used elsewhere
    })
    .catch((err) => {
      console.log("Error fetching questions:", err);
      throw err;
    });
};

// Function remove HTML entities and display the actual characters
function decodeHTML(html) {
  var doc = new DOMParser().parseFromString(html, "text/html");
  return doc.documentElement.textContent;
  /* var tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  return tempElement.textContent || tempElement.innerText; */
}


/* // Function to display a question
const displayQuestion = (index) => {
  const questionText = decodeHTML(questionsData[index].question)
  $('#q-a').html(questionText);
};
 */

// Function to generate answers
/* const generateAnswers = (arr) => {
  const answers = $('.q-answers');

  arr.forEach((answer, index) => {
    const input = $('<input>').attr('type', 'radio').attr('name', 'options').addClass('btn-check').attr('id', `option${index + 1}`).attr('autocomplete', 'off');
    const label = $('<label>').attr('for', `option${index + 1}`).addClass('btn btn-outline-secondary').text(answer);
    answers.append(input, label);
  })
} */

// render the questions
$('#mode-level').on('click', 'button',function (){

  //const modeNumber = $('#mode-number').val();
  const mode = $(this).text().toLowerCase();
  const questions = $("#mode-number").val();
 
  callAPI(mode, questions);
  console.log(mode, questions);
  $('.mode-container').css('display', 'none');// hide the modal
  cssStyle(".control", "visibility", "visible");
  changeText("#q-number", `0/${questions}`);
  //nextBtn();
  /* 
  getQuestions(mode, modeNumber)
  .then((data) => {
      console.log(data)
      $('#q-a').text(displayQuestion(currentIndex)); // show the first question

      generateAnswers(data.results[0].incorrect_answers)

      $('.mode-container').css('display', 'none');// hide the modal

      $('#q-answers').fadeIn(500, function () {   
        $('#main .row').removeClass('justify-content-center');
      });
  })
  .catch((err) => console.error("Error:", err)); */
  
});


$('.arrow-up').on('click', function(){ 
let inputField = $('#mode-number');  
let currentNum = parseInt(inputField.val());
let newNum = currentNum + 1;
if(newNum <= Number(inputField.attr('max'))) inputField.val(newNum);
});

$('.arrow-down').on('click', function(){ 
let inputField = $('#mode-number');
let currentNum = parseInt(inputField.val());
let newNum = currentNum - 1;
if (newNum >= inputField.attr('min')) {
    inputField.val(newNum);
}
});
