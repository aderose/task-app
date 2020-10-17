import inputHandler from "./inputHandler";
import taskManager from "./taskManager";

window.addEventListener("load", handleDocument);

function handleDocument() {
  inputHandler(document);
  taskManager(document);
}
