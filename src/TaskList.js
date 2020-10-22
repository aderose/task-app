import Task from "./Task";
import pubsub from "./pubsub";

class TaskList {
  constructor(doc, container, name) {
    this.name = name;
    this.container = container;
    this.doc = doc;
    this.tasks = [];
    this.increment = 0;
    this.list = doc.createElement("ul");

    // add header & list to container

    const { header, titleTag } = this.createHeader();
    this.titleTag = titleTag;
    this.container.appendChild(header);
    this.container.appendChild(this.list);

    // create menu item
    this.menuItem = doc.createElement("li");
    this.menuItem.setAttribute("class", "list-entry");
    this.menuItem.textContent = this.name;
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

  // create the task list title
  createTitle() {
    const titleTag = this.doc.createElement("button");
    titleTag.setAttribute("class", "title");
    titleTag.textContent = this.name;
    return titleTag;
  }

  // create list header containing a clickable title and add button
  createHeader() {
    const header = this.doc.createElement("div");
    header.setAttribute("class", "list-header");

    const titleTag = this.createTitle();
    const add = this.doc.createElement("i");
    add.setAttribute("class", "add fas fa-plus-circle");

    header.appendChild(titleTag);
    header.appendChild(add);

    return { header, titleTag };
  }

  // provide functionality to all buttons are functional
  initialiseFunctionality() {
    pubsub.subscribe("addTask", this.addTask.bind(this));
    pubsub.subscribe("editTask", this.editTask.bind(this));
    pubsub.subscribe("removeTask", this.removeTask.bind(this));
    pubsub.subscribe("completeTask", this.updateTaskStatus);
    pubsub.publish("createTitleListener", this);
  }

  // unsubscribe from all the task list events
  unsubscribeFromEvents() {
    pubsub.unsubscribe("addTask", this.addTask.bind(this));
    pubsub.unsubscribe("editTask", this.editTask.bind(this));
    pubsub.unsubscribe("removeTask", this.removeTask.bind(this));
    pubsub.unsubscribe("completeTask", this.updateTaskStatus);
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
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

  get titleTag() {
    return this._titleTag;
  }

  set titleTag(titleTag) {
    this._titleTag = titleTag;
  }
}

export default TaskList;
