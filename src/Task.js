import taskElement from "./taskElement";

class Task {
  constructor(id, title, dueDate, priority, isComplete) {
    this.id = id;
    this.title = title || "";
    this.dueDate = dueDate || "";
    this.priority = priority || "Low";
    this.isComplete = isComplete || false;
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set title(title) {
    this._title = title;
  }

  get title() {
    return this._title;
  }

  set dueDate(dueDate) {
    this._dueDate = dueDate;
  }

  get dueDate() {
    return this._dueDate;
  }

  set priority(priority) {
    this._priority = priority;
  }

  get priority() {
    return this._priority;
  }

  set isComplete(isComplete) {
    this._isComplete = isComplete;
  }

  get isComplete() {
    return this._isComplete;
  }

  getElement() {
    return taskElement.createElement(this);
  }
}

export default Task;
