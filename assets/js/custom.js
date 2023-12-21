// e.g htmlElement("selector")
const htmlElement = (id) => document.querySelector(id);

// e.g cssClass("#id", "add", "myClass")
const cssClass = (selector="", action="", cssClass="", element=$(selector)) => {
  switch (action) {
    case "add":
      element.addClass(cssClass);
      break;
    case "remove":
      element.removeClass(cssClass);
      break;
    case "toggle":
      element.toggleClass(cssClass);
      break;
    default:
      break;
  }
}
  
// e.g changeText("#id", "lorem ipso")
//const changeText = (selector="", txt="", element=$(selector)) => element.text(txt);
const changeText = (selector="", txt="", element=htmlElement(selector)) => element.textContent=txt;

// e.g addGlobalEventListener("click", nextQ, "#id")
function addGlobalEventListener(typeOfEvent="", callback, selector="", stopPropagation=true) {
  document.addEventListener(typeOfEvent, (eventObj) => {
    if (eventObj.target.matches(selector)) callback(eventObj);
    if (stopPropagation) eventObj.stopPropagation();
  })
}

/* // Timer object 
const Timer = {
  timerInterval: undefined,
  timeoutInterval: undefined,
  timeoutSet: (callBack)=> Timer.timeoutInterval = setTimeout(callBack, 1000),
  timeoutClr: ()=> clearTimeout(Timer.timeoutInterval),
  setActive : (bool = timeElement.dataset.active)=> timeElement.dataset.active = bool.toString(), 
  active : ()=> String(timeElement.dataset.active),
  setTime : (time = Timer.getTime())=> timeElement.textContent = time,
  getTime : ()=> parseInt(timeElement.textContent),
  start : ()=> {Timer.timerInterval = setInterval(Timer.countdown, 1000); Timer.setActive(true)},
  stop : ()=> {clearInterval(Timer.timerInterval); Timer.setActive(false)},
  deductTime : (time)=> timeElement.textContent=Timer.getTime()-time,
  countdown: ()=> {Timer.deductTime(1); if(Timer.getTime()<1) Timer.outOfTime();},
  outOfTime: ()=> {Timer.setTime(0); endScreen();},
}
Timer.setTime(100);

// soundVar("path/to/soundFile.wav")
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
  //newSound: (key="", src="") => soundsLibrary.sounds[key]=soundVar(src),
} */