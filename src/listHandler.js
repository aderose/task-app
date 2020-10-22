import pubsub from "./pubsub";
import TaskList from "./TaskList";
import listMenu from "./listMenu";

function listHandler(doc) {
  const _lists = [];
  const _container = doc.querySelector(".list-container");
  let currentList = _createExampleList("Example List 1");
  const menu = listMenu(doc);

  // render the current list
  currentList.render();

  // call menu selection function when a menu item is selected
  pubsub.subscribe("menuItemSelected", _makeMenuSelection);
  // show menu when the list title is clicked
  pubsub.subscribe("changeList", _showMenu);

  function _showMenu() {
    menu.render(_lists);
    menu.toggle();
  }

  function _makeMenuSelection(list) {
    console.log(list);
    // currentList.flush();
    // currentList = list;
    // currentList.render();
    menu.toggle();
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
