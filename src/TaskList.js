import Task from "./Task";

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
  editTask({ taskId, taskInfo }) {
    const task = this.getTaskById(taskId);
    task.title = taskInfo.title;
    task.dueDate = taskInfo.datetime;
    task.priority = taskInfo.priority;
  }

  // render the task list by appending it to the provided container
  removeTask(task) {
    this.tasks.splice(this.getTaskIndex(task), 1);
    this.render();
  }

  // get a tasks list index
  getTaskIndex(task) {
    return this.tasks.findIndex((x) => x.id === task.id);
  }

  // get a task from the task list given an id
  getTaskById(id) {
    return this.tasks.reduce((x) => x.id === id);
  }

  // render the task list by appending it to the provided container
  render() {
    this.list.innerHTML = "";
    this.tasks.forEach((task) => this.list.appendChild(task.element));
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
