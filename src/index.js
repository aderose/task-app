import formHandler from "./formHandler";
import inputHandler from "./inputHandler";
import listHandler from "./listHandler";
import storageHandler from "./storageHandler";

window.addEventListener("load", handleDocument);

function handleDocument() {
  storageHandler().pullStorage();
  inputHandler();
  formHandler();
  listHandler();
}
