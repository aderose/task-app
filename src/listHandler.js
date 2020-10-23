import pubsub from "./pubsub";
import TaskList from "./TaskList";
import listMenu from "./listMenu";
import tagFactory from "./tagFactory";

function listHandler() {
  const _lists = [];
  const _container = tagFactory.getTagFromDoc(".list-container ul");
  const _titleBtn = tagFactory.getTagFromDoc(".title");
  const _addTaskBtn = tagFactory.getTagFromDoc(".add");
  const _menu = listMenu();

  // create an example list to start with
  let _activeList = _createExampleList("Example List");

  // set title to the current active list
  _titleBtn.textContent = _activeList.name;

  // show menu when the title button is clicked
  pubsub.publish("createEventListener", {
    type: "click",
    element: _titleBtn,
    fn: () => _menu.show(_lists),
  });

  // publish "addTaskClicked" event when the add task button is clicked
  pubsub.publish("createEventListener", {
    type: "click",
    element: _addTaskBtn,
    fn: () => pubsub.publish("addTaskClicked"),
  });

  // call menu selection function when a menu item is selected
  pubsub.subscribe("menuItemSelected", _makeMenuSelection);

  // show menu when the list title is clicked
  pubsub.subscribe("changeList", _showMenu);

  function _showMenu() {
    _menu.show(_lists);
  }

  // make a new menu selection
  function _makeMenuSelection(list) {
    _activeList.deactivate();
    _activeList = list;
    _titleBtn.textContent = _activeList.name;
    _activeList.activate();
    _menu.hide();
  }

  // create example task list with a few tasks
  function _createExampleList(name) {
    const exampleList = new TaskList(_container, name);
    ["low", "medium", "high"].forEach((v, i) => {
      exampleList.createTask({
        title: `Example Task ${i + 1} - ${v} priority`,
        datetime: `2020-10-0${i + 1}T18:00`,
        priority: v,
      });
    });
    _lists.push(exampleList);
    return exampleList;
  }
}

export default listHandler;
