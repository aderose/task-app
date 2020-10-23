import pubsub from "./pubsub";
import TaskList from "./TaskList";
import listMenu from "./listMenu";
import tagFactory from "./tagFactory";

function listHandler() {
  const _lists = [];
  const _container = tagFactory.getTagFromDoc(".list-container ul");
  const _titleBtn = tagFactory.getTagFromDoc(".title");
  const _addTaskBtn = tagFactory.getTagFromDoc(".add");

  // initialise the listMenu
  listMenu.init();

  // create an example list to start with
  let _activeList = _createExampleList("Example List");
  _createExampleList("lololol");
  _selectList(_activeList);

  // show menu when the title button is clicked
  pubsub.publish("createEventListener", {
    type: "click",
    element: _titleBtn,
    fn: () => listMenu.show(_lists),
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
    listMenu.show(_lists);
  }

  // make a new menu selection
  function _makeMenuSelection(list) {
    _selectList(list);
    listMenu.hide();
  }

  // select a new TaskList object
  function _selectList(list) {
    // deactivate old list
    _activeList.deactivate();

    // update active list
    _activeList = list;

    // update title to match the new list
    _titleBtn.textContent = _activeList.name;

    // activate new list
    _activeList.activate();

    // render the list of tasks for the new list
    _render();
  }

  // create example task list with a few tasks
  function _createExampleList(name) {
    let list = ["do ya work", "do ya sleep", "do ya nothin"];
    if (name === "lololol") list = ["list2 yaya", "list2 nono", "list2 mebe"];
    const exampleList = new TaskList(name);
    ["low", "medium", "high"].forEach((v, i) => {
      exampleList.createTask({
        title: list[i],
        // title: `Example Task ${i + 1} - ${v} priority`,
        datetime: `2020-10-0${i + 1}T18:00`,
        priority: v,
      });
    });
    _lists.push(exampleList);
    return exampleList;
  }

  // render the active task to the browser
  function _render() {
    _container.innerHTML = "";
    _activeList.tasks.forEach((task) => {
      _container.appendChild(task.element.container);
    });
  }
}

export default listHandler;
