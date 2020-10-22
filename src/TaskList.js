import Task from "./Task";
import pubsub from "./pubsub";

class TaskList {
  constructor(doc, container, name) {
    this.name = name;
    this.container = container;
    this.doc = doc;
    this.tasks = [];
    this.increment = 0;
    this.menuItem = this.createMenuItem();
  }

  // add a new task to the task list and render the result
  createTask(task) {
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
  updateTask({ id, taskInfo }) {
    const task = this.getTaskById(id);
    task.title = taskInfo.title;
    task.dueDate = taskInfo.datetime;
    task.priority = taskInfo.priority;
  }

  // render the task list by appending it to the provided container
  deleteTask(task) {
    this.tasks = this.tasks.filter((t) => t !== task);
    this.renderTasks();
  }

  // get a task from the task list given an id
  getTaskById(id) {
    return this.tasks.find((x) => x.id === id);
  }

  // render the task list by appending it to the provided container
  renderTasks() {
    this.container.innerHTML = "";
    this.tasks.forEach((task) =>
      this.container.appendChild(task.element.container)
    );
  }

  // create menu item for this task list
  createMenuItem() {
    const item = this.doc.createElement("li");
    item.setAttribute("class", "list-entry");
    item.textContent = this.name;
    return item;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }
}

export default TaskList;
