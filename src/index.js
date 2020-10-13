import inputHandler from "./inputHandler";
import pubsub from "./pubsub";

window.addEventListener("load", handleDocument);

function handleDocument() {
  inputHandler(document);

  function read(data) {
    console.log(data.title);
    console.log(data.date);
    console.log(data.priority);
  }

  pubsub.subscribe("addTask", read);
}
