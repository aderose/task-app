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

  // create two example lists and display the first
  let _activeList = _createExampleList("Example List");
  _createExampleList("Example List 2");
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
    fn: () => pubsub.publish("createTaskFormOpen"),
  });

  // call menu selection function when a menu item is selected
  pubsub.subscribe("menuItemSelected", _makeMenuSelection);

  // render the task list when the list is updated
  pubsub.subscribe("taskListUpdated", _render);

  // make a new menu selection
  function _makeMenuSelection(list) {
    _selectList(list);
    listMenu.hide();
  }

  // select a new TaskList object and display it
  function _selectList(list) {
    // deactivate old list
    _activeList.deactivate();

    // update active list
    _activeList = list;

    // activate new list
    _activeList.activate();

    // render the new list of tasks
    _render();
  }

  // create example task list with a few tasks
  function _createExampleList(name) {
    let list = ["low priority", "medium priority", "high priority"];
    if (name === "Example List 2") list = ["Task A", "Task B", "Task C"];
    const exampleList = new TaskList(name);
    ["low", "medium", "high"].forEach((v, i) => {
      exampleList.createTask({
        title: list[i],
        datetime: `2020-10-0${i + 1}T18:00`,
        priority: v,
      });
    });
    _lists.push(exampleList);
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
}

export default listHandler;
