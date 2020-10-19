import taskElement from "./taskElement";

class Task {
  constructor(id, title, dueDate, priority, isComplete) {
    this.id = id;
    this.title = title || "";
    this.dueDate = dueDate || "";
    this.priority = priority || "Low";
    this.isComplete = isComplete || false;
    this.element = taskElement.createElement(this);
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set title(title) {
    this._title = title;
    // update title element with new title on update
    if (this.element) taskElement.updateTitle(this.element, title);
  }

  get title() {
    return this._title;
  }

  set dueDate(dueDate) {
    this._dueDate = dueDate;
    // update dueDate element with new dueDate on update
    if (this.element) taskElement.updateDueDate(this.element, dueDate);
  }

  get dueDate() {
    return this._dueDate;
  }

  set priority(priority) {
    this._priority = priority;
    // update priority styling with new priority on update
    if (this.element) taskElement.updatePriority(this.element, priority);
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

  set element(element) {
    this._element = element;
  }

  get element() {
    return this._element;
  }
}

export default Task;
