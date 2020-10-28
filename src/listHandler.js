import pubsub from './pubsub';
import TaskList from './TaskList';
import tagFactory from './tagFactory';

function listHandler() {
  const container = tagFactory.getTagFromDoc('.list-container ul');
  const titleBtn = tagFactory.getTagFromDoc('.title');
  const addTaskBtn = tagFactory.getTagFromDoc('.add');
  const listMenu = tagFactory.getTagFromDoc('.list-selection-container ul');
  let lists = [];
  let activeList;
  let increment = 0;

  // render the active task to the browser
  function render() {
    // update title to match the new list
    titleBtn.textContent = activeList.name || 'Click here to add list';

    // update the list container with the task element containers
    container.innerHTML = '';
    activeList.tasks.forEach((task) => {
      container.appendChild(task.element.container);
    });
  }

  // re-render the task list menu
  function renderMenu() {
    listMenu.innerHTML = '';
    lists.forEach((list) => listMenu.appendChild(list.menuItem.container));
  }

  // get task list by id
  function getListById(id) {
    return lists.find((list) => list.id === id);
  }

  // update storage with current data
  function updateStorage() {
    const storage = {
      activeId: (activeList || {}).id,
      listIncrement: increment,
      lists: [],
    };

    lists.forEach((list) => {
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
    pubsub.publish('updateStorage', storage);
  }

  // select a new TaskList object and display it
  function selectList(list) {
    // deactivate old list
    if (activeList) activeList.deactivate();

    // update active list
    activeList = list;

    // activate new list
    activeList.activate();

    // render the new list of tasks
    render();

    // update storage with the new activeId
    updateStorage();
  }

  // create example task list with a few tasks
  function createExampleList(name) {
    const exampleList = new TaskList(increment, name);
    increment += 1;
    ['low', 'medium', 'high'].forEach((v, i) => {
      exampleList.createTask({
        title: `${v}-priority`,
        datetime: `2020-10-0${i + 1}T18:00`,
        priority: v,
      });
    });
    return exampleList;
  }

  // create a new tasklist using the provided input
  function createList(input) {
    const newList = input
      ? new TaskList(
          Number(input.id) === input.id ? input.id : increment,
          input['add-list-input'] || input.name,
          input.taskIncrement,
        )
      : createExampleList('Example List');
    increment += 1;
    lists.push(newList);
    renderMenu();
    updateStorage();

    // if we are not loading from storage, select the new list
    if (input && !input.name) selectList(newList);
    return newList;
  }

  // create the edit list form and show it to the user
  function commenceUpdateList(taskList) {
    // remove event listeners from the menu item
    taskList.removeMenuListeners();

    // switch the menu item display over to a form
    taskList.updateMenuItem('form');

    // create form object for the current menu item
    pubsub.publish('createForm', {
      type: 'updateList',
      formName: `.update-${taskList.id}`,
    });

    // show the form and listen for a submission event
    const defaults = {};
    defaults[taskList.id] = taskList.name;

    pubsub.publish('showForm', {
      formName: `.update-${taskList.id}`,
      id: taskList.id,
      defaults,
    });
  }

  // update the task list title provided the given input
  function completeUpdateList(input) {
    const taskList = getListById(Number(input.id));
    // update tasklist name in each interface
    taskList.updateName(input['list-name']);
    if (activeList === taskList) titleBtn.textContent = input['list-name'];
    // re-add listeners to the menu controls
    taskList.addMenuListeners();

    // switch menu item back to uneditable form
    taskList.updateMenuItem();

    updateStorage();
  }

  // Delete the provided task list
  function deleteList(taskList) {
    taskList.remove();
    lists = lists.filter((list) => list !== taskList);
    render();
    renderMenu();
    updateStorage();
  }

  // make a new menu selection
  function makeMenuSelection(list) {
    selectList(list);
    pubsub.publish('createListFormHide');
  }

  function taskListUpdated() {
    render();
    updateStorage();
  }

  function init(storage) {
    // decompose storage and re-create objects
    if (storage !== null) {
      increment = storage.listIncrement;
      storage.lists.forEach((list) => {
        const taskList = createList(list);
        list.tasks.forEach((task) => taskList.createTask(task));
      });
      // select the previously active list
      selectList(getListById(Number(storage.activeId)));
    } else {
      // create new list if no storage is present
      selectList(createList());
    }

    // subscribe to the respective events
    pubsub.subscribe('menuItemSelected', makeMenuSelection);
    pubsub.subscribe('createListSubmitted', createList);
    pubsub.subscribe('updateTaskList', commenceUpdateList);
    pubsub.subscribe('updateListSubmitted', completeUpdateList);
    pubsub.subscribe('deleteTaskList', deleteList);
    pubsub.subscribe('taskListUpdated', taskListUpdated);
  }

  // retrieve local storage and initialise lists
  pubsub.subscribe('storageRetrieved', init);

  // get storage on initialisation
  pubsub.publish('getStorage');

  // show menu when the title button is clicked
  pubsub.publish('createEventListener', {
    type: 'click',
    element: titleBtn,
    fn: () => {
      pubsub.publish('createListFormOpen');
    },
  });

  // publish "addTaskClicked" event when the add task button is clicked
  pubsub.publish('createEventListener', {
    type: 'click',
    element: addTaskBtn,
    fn: () => pubsub.publish('createTaskFormOpen'),
  });
}

export default listHandler;
