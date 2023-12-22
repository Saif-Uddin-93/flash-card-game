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
    if (eventObj.target.matches(selector)) callback();
    if (stopPropagation) eventObj.stopPropagation();
  })
}

// Timer object 
const timeElement = htmlElement("#q-timer")
const Timer = {
  timerInterval: undefined,
  timeoutInterval: undefined,
  timeoutSet: (callBack, ms=1000)=> Timer.timeoutInterval = setTimeout(callBack, ms),
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

/* MT */
// slider for Q/A font size 
$("#q-slider").on("input", function () {
  $('#q-a').css("font-size", $(this).val() + "px");
  /* SU: storing font size to local storage */
  localStorage.setItem("q-font-size", $(this).val())
});
