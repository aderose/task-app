import pubsub from "./pubsub";
import TaskList from "./TaskList";

function listHandler(doc) {
  const _lists = [];
  const _listContainer = doc.querySelector(".list-container");
  // get list selection menu container from the document
  const _menuContainer = doc.querySelector(".list-selection-container");
  // get the menu container from the document
  const _menu = doc.querySelector(".list-selection-container ul");
  const _closeSelection = doc.querySelector(".select-close");

  // create an example for the user and render it
  let currentList = _createExampleList();
  currentList.render();

  pubsub.publish("closeListListener", _closeSelection);
  pubsub.subscribe("changeList", _toggleListSelection);
  pubsub.subscribe("hideSelection", _toggleListSelection);
  pubsub.subscribe("menuSelection", _makeMenuSelection);

  function _makeMenuSelection(list) {
    // currentList.flush();
    // currentList = list;
    // currentList.render();
    _toggleListSelection();
  }

  // toggle the list selection menu
  function _toggleListSelection() {
    _menuContainer.classList.toggle("visible");
    renderMenu();
  }

  function renderMenu() {
    _menu.innerHTML = "";
    _lists.forEach((list) => _menu.appendChild(list.menuItem));
  }

  // create example task list with a few tasks
  function _createExampleList() {
    const exampleList = new TaskList(doc, _listContainer, "Example List");
    exampleList.addTask({
      title: "Example Task 1 - Low Priority",
      datetime: "2020-10-22T18:00",
      priority: "low",
    });
    exampleList.addTask({
      title: "Example Task 2 - Medium Priority",
      datetime: "2020-10-28T08:00",
      priority: "medium",
    });
    exampleList.addTask({
      title: "Example Task 3 - High Priority",
      datetime: "2020-10-31T23:00",
      priority: "high",
    });
    _lists.push(exampleList);
    return exampleList;
  }
}

export default listHandler;
