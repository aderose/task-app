import TaskList from "./TaskList";

function listHandler(doc) {
  const _container = doc.querySelector(".list-container");
  const _taskList = new TaskList(doc, _container, "E.g. List");
  _taskList.subscribeToTaskEvents();
}

export default listHandler;
