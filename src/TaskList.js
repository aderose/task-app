import Task from "./Task";
import pubsub from "./pubsub";
import tagFactory from "./tagFactory";

class TaskList {
  constructor(name) {
    this.name = name;
    this.tasks = [];
    this.increment = 0;
    this.menuItem = this._createMenuItem();

    // publish a menuItemSelected event when the menuItem is clicked
    pubsub.publish("createEventListener", {
      element: this.menuItem.container,
      type: "click",
      fn: () => pubsub.publish("menuItemSelected", this),
    });
  }

  // add functionality to this TaskList object
  activate() {
    this.subscriptions = this._subscribeToTaskEvents();
    this.tasks.forEach((task) => task.addEventListeners());
  }

  // remove functionality from this TaskList object
  deactivate() {
    // if the task list has no subscriptions, it musn't have been activated
    // yet and therefore will have no event listeners
    if (!this.subscriptions) return;
    this._unsubscribeFromTaskEvents(this.subscriptions);
    this.tasks.forEach((task) => task.removeEventListeners());
  }

  // add a new task to the task list and render the result
  createTask(info) {
    const task = new Task(
      this.increment++,
      info.title,
      info.datetime,
      info.priority,
      false
    );
    this.tasks.push(task);
    task.addEventListeners();
    pubsub.publish("taskListUpdated");
  }

  // update the task associated with the given taskId with the new taskInfo
  updateTask(info) {
    const task = this._getTaskById(Number(info.id));
    task.title = info.title;
    task.dueDate = info.datetime;
    task.priority = info.priority;
  }

  // render the task list by appending it to the provided container
  deleteTask(task) {
    task.removeEventListeners();
    this.tasks = this.tasks.filter((t) => t !== task);
    pubsub.publish("taskListUpdated");
  }

  // create a menu itemm containing a delete and edit button
  _createMenuItem() {
    const container = tagFactory.createTag("li", { class: "list-entry" });
    const name = tagFactory.createTag("p", {}, this.name);
    const controls = tagFactory.createTag("div", { class: "controls" });
    const editList = tagFactory
      .createTag("button")
      .appendChild(tagFactory.createTag("i", { class: "far fa-edit" }));
    const deleteList = tagFactory
      .createTag("button")
      .appendChild(tagFactory.createTag("i", { class: "far fa-trash-alt" }));

    controls.appendChild(editList);
    controls.appendChild(deleteList);
    container.appendChild(name);
    container.appendChild(controls);

    return { container, editList, deleteList };
  }

  // get a task from the task list given an id
  _getTaskById(id) {
    return this.tasks.find((x) => x.id === id);
  }

  // subscribe to each of the task alteration events
  _subscribeToTaskEvents() {
    return [
      pubsub.subscribe("createTaskSubmitted", this.createTask.bind(this)),
      pubsub.subscribe("updateTaskSubmitted", this.updateTask.bind(this)),
      pubsub.subscribe("deleteTask", this.deleteTask.bind(this)),
    ];
  }

  // unsubscribe from each of the task alteration events
  _unsubscribeFromTaskEvents(subscriptions) {
    subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get tasks() {
    return this._tasks;
  }

  set tasks(tasks) {
    this._tasks = tasks;
  }

  get increment() {
    return this._increment;
  }

  set increment(increment) {
    this._increment = increment;
  }

  get menuItem() {
    return this._menuItem;
  }

  set menuItem(menuItem) {
    this._menuItem = menuItem;
  }

  get subscriptions() {
    return this._subscriptions;
  }

  set subscriptions(subscriptions) {
    this._subscriptions = subscriptions;
  }
}

export default TaskList;
