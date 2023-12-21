//$(()=>{
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
//});