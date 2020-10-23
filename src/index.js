import formHandler from "./formHandler";
import inputHandler from "./inputHandler";
import listHandler from "./listHandler";

window.addEventListener("load", handleDocument);

function handleDocument() {
  inputHandler();
  formHandler();
  listHandler();
}
