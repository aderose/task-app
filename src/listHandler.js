import pubsub from "./pubsub";
import TaskList from "./TaskList";
import listMenu from "./listMenu";

function listHandler(doc) {
  const _lists = [];
  const _container = doc.querySelector(".list-container");
  const _menu = listMenu(doc);
  let currentList = _createExampleList("Example List 1");

  // render the current list
  _makeMenuSelection(currentList);

  // call menu selection function when a menu item is selected
  pubsub.subscribe("menuItemSelected", _makeMenuSelection);
  // show menu when the list title is clicked
  pubsub.subscribe("changeList", _showMenu);

  function _showMenu() {
    _menu.show(_lists);
  }

  function _makeMenuSelection(list) {
    currentList.flush();
    currentList = list;
    currentList.render();
    _menu.hide();
  }

  // create example task list with a few tasks
  function _createExampleList(name) {
    const exampleList = new TaskList(doc, _container, name);
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
