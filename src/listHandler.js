import pubsub from "./pubsub";
import TaskList from "./TaskList";

function listHandler(doc) {
  const _container = doc.querySelector(".list-container");
  _createExampleList();

  pubsub.subscribe("changeList", _loadListForm);

  function _loadListForm() {
    console.log("loading...");
  }

  // create example task list with a few tasks
  function _createExampleList() {
    const exampleList = new TaskList(doc, _container, "Example List");
    exampleList.addTask({
      title: "Example Task 1",
      datetime: "2020-10-22T18:00",
      priority: "low",
    });
    exampleList.addTask({
      title: "Example Task 2",
      datetime: "2020-10-28T08:00",
      priority: "medium",
    });
    exampleList.addTask({
      title: "Example Task 3",
      datetime: "2020-10-31T23:00",
      priority: "high",
    });
    exampleList.subscribeToEvents();
  }
}

export default listHandler;
