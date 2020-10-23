import Task from "./Task";
import pubsub from "./pubsub";
import tagFactory from "./tagFactory";

class TaskList {
  constructor(container, name) {
    this.name = name;
    this.container = container;
    this.tasks = [];
    this.increment = 0;
    this.menuItem = tagFactory.createTag(
      "li",
      { class: "list-entry" },
      this.name
    );
    this.subscriptions = this._subscribeToTaskEvents();

    // publish a menuItemSelected event when the menuItem is clicked
    pubsub.publish("createEventListener", {
      element: this.menuItem,
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
    this.renderTasks();
  }

  // update the task associated with the given taskId with the new taskInfo
  updateTask({ id, taskInfo }) {
    const task = this._getTaskById(id);
    task.title = taskInfo.title;
    task.dueDate = taskInfo.datetime;
    task.priority = taskInfo.priority;
  }

  // render the task list by appending it to the provided container
  deleteTask(task) {
    task.removeEventListeners();
    this.tasks = this.tasks.filter((t) => t !== task);
    this.renderTasks();
  }

  // render the task list by appending it to the provided container
  renderTasks() {
    this.container.innerHTML = "";
    this.tasks.forEach((task) =>
      this.container.appendChild(task.element.container)
    );
  }

  // get a task from the task list given an id
  _getTaskById(id) {
    return this.tasks.find((x) => x.id === id);
  }

  // subscribe to each of the task alteration events
  _subscribeToTaskEvents() {
    return [
      pubsub.subscribe("createTask", this.createTask.bind(this)),
      pubsub.subscribe("updateTask", this.updateTask.bind(this)),
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

  get container() {
    return this._container;
  }

  set container(container) {
    this._container = container;
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
