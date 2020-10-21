import Task from "./Task";
import pubsub from "./pubsub";

class TaskList {
  constructor(doc, container, name) {
    this.name = name;
    this.container = container;
    this.tasks = [];
    this.increment = 0;
    this.list = doc.createElement("ul");

    // add header & list to container
    this.container.appendChild(this.createHeader(doc, name));
    this.container.appendChild(this.list);
  }

  // add a new task to the task list and render the result
  addTask(task) {
    this.tasks.push(
      new Task(
        this.increment++,
        task.title,
        task.datetime,
        task.priority,
        false
      )
    );
    this.render();
  }

  // update the task associated with the given taskId with the new taskInfo
  editTask({ id, taskInfo }) {
    const task = this.getTaskById(id);
    task.title = taskInfo.title;
    task.dueDate = taskInfo.datetime;
    task.priority = taskInfo.priority;
  }

  // render the task list by appending it to the provided container
  removeTask(task) {
    this.tasks.splice(this.getTaskIndex(task), 1);
    this.render();
  }

  // update the task & task element's status
  updateTaskStatus(task) {
    task.updateStatus();
  }

  // get a tasks list index
  getTaskIndex(task) {
    return this.tasks.findIndex((x) => x.id === task.id);
  }

  // get a task from the task list given an id
  getTaskById(id) {
    return this.tasks.find((x) => x.id === id);
  }

  // render the task list by appending it to the provided container
  render() {
    this.list.innerHTML = "";
    this.tasks.forEach((task) => this.list.appendChild(task.element.container));
  }

  // create list header containing a clickable title and add button
  createHeader(doc, name) {
    const header = doc.createElement("div");
    header.setAttribute("class", "list-header");
    const titleBtn = doc.createElement("button");
    const titleText = doc.createElement("h2");
    titleText.setAttribute("id", "title");
    titleText.textContent = name;
    titleBtn.appendChild(titleText);

    const add = doc.createElement("i");
    add.setAttribute("class", "add fas fa-plus-circle");

    header.appendChild(titleBtn);
    header.appendChild(add);

    return header;
  }

  // subscribe to all the task list events
  subscribeToTaskEvents() {
    pubsub.subscribe("addTask", this.addTask.bind(this));
    pubsub.subscribe("editTask", this.editTask.bind(this));
    pubsub.subscribe("removeTask", this.removeTask.bind(this));
    pubsub.subscribe("completeTask", this.updateTaskStatus);
  }

  // unsubscribe from all the task list events
  unsubscribeFromTaskEvents() {
    pubsub.unsubscribe("addTask", this.addTask.bind(this));
    pubsub.unsubscribe("editTask", this.editTask.bind(this));
    pubsub.unsubscribe("removeTask", this.removeTask.bind(this));
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this.name;
  }

  set tasks(tasks) {
    this._tasks = tasks;
  }

  get tasks() {
    return this._tasks;
  }

  set incrementor(incrementor) {
    this._incrementor = incrementor;
  }

  get incrementor() {
    return this._incrementor;
  }

  set container(container) {
    this._container = container;
  }

  get container() {
    return this._container;
  }
}

export default TaskList;
