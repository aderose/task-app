import pubsub from "./pubsub";
import TaskList from "./TaskList";

function listHandler(doc) {
  const _container = doc.querySelector(".list-container");
  const _taskList = new TaskList(doc, _container, "E.g. List");

  // subscribe to all the task list events
  function _subscribeToEvents() {
    pubsub.subscribe("addTask", _taskList.addTask.bind(_taskList));
    pubsub.subscribe("editTask", _taskList.editTask.bind(_taskList));
    pubsub.subscribe("removeTask", _taskList.removeTask.bind(_taskList));
  }

  // unsubscribe from all the task list events
  function _unsubscribeFromEvents() {
    pubsub.unsubscribe("addTask", _taskList.addTask.bind(_taskList));
    pubsub.unsubscribe("editTask", _taskList.editTask.bind(_taskList));
    pubsub.unsubscribe("removeTask", _taskList.removeTask.bind(_taskList));
  }

  _subscribeToEvents();
}

export default listHandler;
