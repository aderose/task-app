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
    pubsub.subscribe("deleteTask", this.deleteTask.bind(this));
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
    const task = this.getTaskById(id);
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
  getTaskById(id) {
    return this.tasks.find((x) => x.id === id);
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }
}

export default TaskList;
