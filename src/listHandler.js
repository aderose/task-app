import pubsub from "./pubsub";
import TaskList from "./TaskList";
import tagFactory from "./tagFactory";

function listHandler() {
  const _container = tagFactory.getTagFromDoc(".list-container ul");
  const _titleBtn = tagFactory.getTagFromDoc(".title");
  const _addTaskBtn = tagFactory.getTagFromDoc(".add");
  const _listMenu = tagFactory.getTagFromDoc(".list-selection-container ul");
  let _lists = [];
  let increment = 0;
  let _activeList = undefined;

  pubsub.subscribe("storageRetrieved", init);
  pubsub.publish("getStorage");
  subscribeToMenuEvents();

  function init(storage) {
    // if there is no storage, create an example list and select it
    if (!storage) return _selectList(_createList());
    increment = storage.listIncrement;
    storage.lists.forEach((list) => {
      const taskList = _createList(list);
      list.tasks.forEach((task) => taskList.createTask(task));
    });

    // select the previously active list
    _selectList(_getListById(Number(storage.activeId)));
  }

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

  function subscribeToMenuEvents() {
    pubsub.subscribe("menuItemSelected", _makeMenuSelection);
    pubsub.subscribe("createListSubmitted", _createList);
    pubsub.subscribe("updateTaskList", _commenceUpdateList);
    pubsub.subscribe("updateListSubmitted", _completeUpdateList);
    pubsub.subscribe("deleteTaskList", _deleteList);
  }

  // update local storage and re-render the list
  pubsub.subscribe("taskListUpdated", taskListUpdated);
  function taskListUpdated() {
    _render();
    _updateStorage();
  }

  // create the edit list form and show it to the user
  function _commenceUpdateList(taskList) {
    // remove event listeners from the menu item
    taskList.removeMenuListeners();

    // switch the menu item display over to a form
    taskList.updateMenuItem("form");

    // create form object for the current menu item
    pubsub.publish("createForm", {
      type: "updateList",
      formName: `.update-${taskList.id}`,
    });

    // show the form and listen for a submission event
    const defaults = {};
    defaults[taskList.id] = taskList.name;

    pubsub.publish("showForm", {
      formName: `.update-${taskList.id}`,
      id: taskList.id,
      defaults: defaults,
    });
  }

  // update the task list title provided the given input
  function _completeUpdateList(input) {
    const taskList = _getListById(Number(input.id));
    // update tasklist name in each interface
    taskList.updateName(input["list-name"]);
    if (_activeList === taskList) _titleBtn.textContent = input["list-name"];
    // re-add listeners to the menu controls
    taskList.addMenuListeners();

    // switch menu item back to uneditable form
    taskList.updateMenuItem();

    _updateStorage();
  }

  // Delete the provided task list
  function _deleteList(taskList) {
    taskList.remove();
    _lists = _lists.filter((list) => list !== taskList);
    _render();
    _renderMenu();
    _updateStorage();
  }

  // create a new tasklist using the provided input
  function _createList(input) {
    const newList = input
      ? new TaskList(
          Number(input.id) === input.id ? input.id : increment++,
          input["add-list-input"] || input.name,
          input.taskIncrement
        )
      : _createExampleList("Example List");
    _lists.push(newList);
    _renderMenu();
    _updateStorage();

    // if we are not loading from storage, select the new list
    if (input && !input.name) _selectList(newList);
    return newList;
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

    // update storage with the new activeId
    _updateStorage();
  }

  // create example task list with a few tasks
  function _createExampleList(name) {
    const exampleList = new TaskList(increment++, name);
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
    _titleBtn.textContent = _activeList.name || "Click here to add list";

    // update the list container with the task element containers
    _container.innerHTML = "";
    _activeList.tasks.forEach((task) => {
      _container.appendChild(task.element.container);
    });
  }

  // re-render the task list menu
  function _renderMenu() {
    _listMenu.innerHTML = "";
    _lists.forEach((list) => _listMenu.appendChild(list.menuItem.container));
  }

  // update storage with current data
  function _updateStorage() {
    const storage = {
      activeId: (_activeList || {}).id,
      listIncrement: increment,
      lists: [],
    };

    _lists.forEach((list) => {
      const taskList = {
        id: list.id,
        name: list.name,
        taskIncrement: list.increment,
        tasks: [],
      };

      list.tasks.forEach((task) => {
        taskList.tasks.push({
          id: task.id,
          title: task.title,
          datetime: task.dueDate,
          priority: task.priority,
          isComplete: task.isComplete,
        });
      });

      storage.lists.push(taskList);
    });
    pubsub.publish("updateStorage", storage);
  }

  // get task list by id
  function _getListById(id) {
    return _lists.find((list) => list.id === id);
  }
}

export default listHandler;
