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

    // create list header and unpack
    const { header, titleTag, add } = this.createHeader();
    this.header = header;
    this.titleTag = titleTag;
    this.add = add;

    // create menu item
    this.menuItem = this.createMenuItem();
  }

  // render the TaskList to the parent container then initialise functionality
  render() {
    this.container.appendChild(this.header);
    this.container.appendChild(this.list);
    this.initialiseFunctionality();
  }

  // flush the list from the parent container
  flush() {
    this.container.innerHTML = "";
    this.unsubscribeFromEvents();
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
    this.renderTasks();
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
    console.log(task);
    this.tasks = this.tasks.filter((t) => t !== task);
    this.renderTasks();
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
  renderTasks() {
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

    return { header, titleTag, add };
  }

  // create menu item for this task list
  createMenuItem() {
    const item = this.doc.createElement("li");
    item.setAttribute("class", "list-entry");
    item.textContent = this.name;
    return item;
  }

  // provide functionality to all buttons are functional
  initialiseFunctionality() {
    pubsub.subscribe("addTask", this.addTask.bind(this));
    pubsub.subscribe("editTask", this.editTask.bind(this));
    pubsub.subscribe("removeTask", this.removeTask.bind(this));
    pubsub.subscribe("completeTask", this.updateTaskStatus);

    // listen for click on the add task button
    pubsub.publish("createAddListener", this.add);

    // listen for a click on this list's title
    pubsub.publish("createTitleListener", this);

    // listen for click on this list's menu item
    pubsub.publish("createMenuListener", this);
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

  get header() {
    return this._header;
  }

  set header(header) {
    this._header = header;
  }
}

export default TaskList;
