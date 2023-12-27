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

// --------- >Settings> ---------
const settings={
  sfxElement: htmlElement("#setting-sound"),
  lightElement: htmlElement("#setting-appearance-light"),
  darkElement: htmlElement("#setting-appearance-dark"),
  soundFX: (save)=> {
    if(!save){
      return localStorage.getItem("quiz-sfx")===null ? settings.sfxElement.checked : localStorage.getItem("quiz-sfx")}
    else {
      return settings.sfxElement.checked
    }},
  colourMode: (/* eventObj, */ theme)=> {
    //theme = theme||eventObj.target.getAttribute("value");
    settings.lightElement.checked = theme === "lightElement"
    settings.darkElement.checked = theme === "darkElement"
  },
  clearLocal: ()=> {localStorage.clear(); sessionStorage.clear()},
  save: (btn)=> {
    localStorage.setItem("quiz-sfx", settings.soundFX(true))
    
    const themeInput = $('input[name="setting-appearance"]:checked').val();
    console.log(themeInput);
    localStorage.setItem("theme", themeInput)

    btn.target.classList.add("saved");
    btn.target.textContent = "Saved!";
    Timer.timeoutSet(()=>{
      btn.target.classList.remove("saved");
      btn.target.textContent = "Save changes";  
    }, 1)

    settings.loadSettings();
  },
  loadSettings: ()=>{
    const loadTheme = localStorage.getItem("theme")===null ? "lightElement" : localStorage.getItem("theme")
    settings.colourMode(/* undefined, */ loadTheme)

    settings.sfxElement.checked = settings.soundFX()==="true"||true?true:settings.sfxElement.checked;
    settings.sfxElement.checked = settings.soundFX()==="false"||false?false:settings.sfxElement.checked;

    $('#q-slider').attr("value", `${localStorage.getItem("q-font-size")||"40"}`);
    $('#q-a').css("font-size", `${localStorage.getItem("q-font-size")||"40"}px`);

    //placeholder to load current selected theme
    (theme = loadTheme)=>{
      // toggle dark/light theme css classes
    }
  },
}
// --------- <Settings< ---------

/* MT */
document.addEventListener('DOMContentLoaded', function () {
   // Trigger the Trivia Level Modal on page load
   //var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
   //myModal.show();
   
   /* SU: loading font size moved to settings.loadSettings()*/
   settings.loadSettings();
});

// slider for Q/A font size 
$("#q-slider").on("input", function () {
  $('#q-a').css("font-size", $(this).val() + "px");
  /* SU: storing font size to local storage */
  localStorage.setItem("q-font-size", $(this).val())
});

// Function remove HTML entities and display the actual characters
function decodeHTML(html) {
  var doc = new DOMParser().parseFromString(html, "text/html");
  return doc.documentElement.textContent;
  /* var tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  return tempElement.textContent || tempElement.innerText; */
}

// render the questions after selecting mode
$('#mode-level').on('click', 'button',function (){

  //const modeNumber = $('#mode-number').val();
  const mode = $(this).text().toLowerCase();
  const questions = $("#mode-number").val();
 
  callAPI(mode, questions);
  console.log(mode, questions);
  $('.mode-container').css('display', 'none');// hide the modal
  cssStyle("#next-btn", "visibility", "visible");
  changeText("#q-number", `0/${questions}`);
  trackQ = -1;
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

// flip the card on HINT click
$('#flashcard-hint').on('click', function(){

  $('.flashcard-inner').addClass('flashcard-flip');

  setTimeout(function(){
    $('.flashcard-inner').removeClass('flashcard-flip');
  }, 2000);

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



