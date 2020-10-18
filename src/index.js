import formHandler from "./formHandler";
import inputHandler from "./inputHandler";
import taskManager from "./taskManager";

window.addEventListener("load", handleDocument);

function handleDocument() {
  inputHandler(document);
  formHandler(document);
  taskManager(document.querySelector("ul"));
}
