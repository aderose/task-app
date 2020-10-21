import pubsub from "./pubsub";
import TaskList from "./TaskList";

function listHandler(doc) {
  const _container = doc.querySelector(".list-container");
  const _taskList = new TaskList(doc, _container, "E.g. List");
  _taskList.subscribeToEvents();

  pubsub.subscribe("changeList", _loadListForm);

  function _loadListForm() {
    console.log("loading...");
  }
}

export default listHandler;
