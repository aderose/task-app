import pubsub from "./pubsub";
import TaskList from "./TaskList";
import listMenu from "./listMenu";

function listHandler(doc) {
  const _lists = [];
  const _container = doc.querySelector(".list-container ul");
  const _titleBtn = doc.querySelector(".title");
  const _addTaskBtn = doc.querySelector(".add");
  const _menu = listMenu(doc);
  let activeList = undefined;

  init();

  function init() {
    activeList = _createExampleList("Example List 1");

    _titleBtn.textContent = activeList.name;

    // add listener to title, which publishes a "titleClicked" event on click
    pubsub.publish("createEventListener", {
      type: "click",
      element: _titleBtn,
      fn: () => pubsub.publish("titleClicked", _lists),
    });

    // add listener to addTaskBtn, which published "addTaskClicked" on click
    pubsub.publish("createEventListener", {
      type: "click",
      element: _addTaskBtn,
      fn: () => pubsub.publish("addTaskClicked"),
    });

    // call menu selection function when a menu item is selected
    pubsub.subscribe("menuItemSelected", _makeMenuSelection);
    // show menu when the list title is clicked
    pubsub.subscribe("changeList", _showMenu);

    //_makeMenuSelection(activeList);
  }

  function _showMenu() {
    _menu.show(_lists);
  }

  function _makeMenuSelection(list) {
    activeList.flush();
    activeList = list;
    _titleBtn.textContent = activeList.name;
    activeList.render();
    _menu.hide();
  }

  // create example task list with a few tasks
  function _createExampleList(name) {
    const exampleList = new TaskList(_container, name);
    exampleList.createTask({
      title: "Example Task 1 - Low Priority",
      datetime: "2020-10-22T18:00",
      priority: "low",
    });
    exampleList.createTask({
      title: "Example Task 2 - Medium Priority",
      datetime: "2020-10-28T08:00",
      priority: "medium",
    });
    exampleList.createTask({
      title: "Example Task 3 - High Priority",
      datetime: "2020-10-31T23:00",
      priority: "high",
    });
    _lists.push(exampleList);
    return exampleList;
  }
}

export default listHandler;
