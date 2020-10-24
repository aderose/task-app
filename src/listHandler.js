import pubsub from "./pubsub";
import TaskList from "./TaskList";
import tagFactory from "./tagFactory";

function listHandler() {
  const _lists = [];
  const _container = tagFactory.getTagFromDoc(".list-container ul");
  const _titleBtn = tagFactory.getTagFromDoc(".title");
  const _addTaskBtn = tagFactory.getTagFromDoc(".add");
  const _listMenu = tagFactory.getTagFromDoc(".list-selection-container ul");
  let _activeList = undefined;

  // create an example list to start with
  _createList();

  // show menu when the title button is clicked
  pubsub.publish("createEventListener", {
    type: "click",
    element: _titleBtn,
    fn: () => {
      pubsub.publish("createListFormOpen");
    },
  });

  // publish "addTaskClicked" event when the add task button is clicked
  pubsub.publish("createEventListener", {
    type: "click",
    element: _addTaskBtn,
    fn: () => pubsub.publish("createTaskFormOpen"),
  });

  // call menu selection function when a menu item is selected
  pubsub.subscribe("menuItemSelected", _makeMenuSelection);

  // render the task list when the list is updated
  pubsub.subscribe("taskListUpdated", _render);

  // listen for when a new tasklist submission has occurred
  pubsub.subscribe("createListSubmitted", _createList);

  // create a new tasklist using the provided input
  function _createList(input) {
    const newList = input
      ? new TaskList(input["add-list-input"])
      : _createExampleList("Example List");
    _lists.push(newList);
    _renderMenu();
    _selectList(newList);
  }

  // make a new menu selection
  function _makeMenuSelection(list) {
    _selectList(list);
    pubsub.publish("createListFormHide");
  }

  // select a new TaskList object and display it
  function _selectList(list) {
    // deactivate old list
    if (_activeList) _activeList.deactivate();

    // update active list
    _activeList = list;

    // activate new list
    _activeList.activate();

    // render the new list of tasks
    _render();
  }

  // create example task list with a few tasks
  function _createExampleList(name) {
    const exampleList = new TaskList(name);
    ["low", "medium", "high"].forEach((v, i) => {
      exampleList.createTask({
        title: `${v}-priority`,
        datetime: `2020-10-0${i + 1}T18:00`,
        priority: v,
      });
    });
    return exampleList;
  }

  // render the active task to the browser
  function _render() {
    // update title to match the new list
    _titleBtn.textContent = _activeList.name;

    // update the list container with the task element containers
    _container.innerHTML = "";
    _activeList.tasks.forEach((task) => {
      _container.appendChild(task.element.container);
    });
  }

  // re-render the task list menu
  function _renderMenu() {
    _listMenu.innerHTML = "";
    _lists.forEach((list) => _listMenu.appendChild(list.menuItem));
  }
}

export default listHandler;
