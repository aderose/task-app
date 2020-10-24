import pubsub from "./pubsub";
import taskElement from "./taskElement";

class Task {
  constructor(id, title, dueDate, priority, isComplete) {
    this.id = id;
    this.title = title || "";
    this.dueDate = dueDate || "";
    this.priority = priority || "Low";
    this.isComplete = isComplete || false;
    this.element = taskElement.createElement(this);
    this.listenersActive = false;
  }

  // set up event listeners on the task element
  addEventListeners() {
    if (this.listenersActive) return;
    // update the task status when the element is clicked
    pubsub.publish("createEventListener", {
      element: this.element.container,
      type: "click",
      fn: this.updateStatus.bind(this),
    });

    // edit this task
    pubsub.publish("createEventListener", {
      element: this.element.editTag,
      type: "click",
      fn: (e) => {
        // open the edit task form
        pubsub.publish("updateTaskFormOpen", this);
        e.stopPropagation();
      },
    });

    // delete this task
    pubsub.publish("createEventListener", {
      element: this.element.trashTag,
      type: "click",
      fn: (e) => {
        pubsub.publish("deleteTask", this);
        e.stopPropagation();
      },
    });
    this.listenersActive = true;
  }

  // remove event listeners from the task element
  removeEventListeners() {
    if (!this.listenersActive) return;
    // remove click listener on the container
    pubsub.publish("deleteEventListener", {
      element: this.element.container,
      type: "click",
    });

    // // remove click listener on the edit icon
    pubsub.publish("deleteEventListener", {
      element: this.element.editTag,
      type: "click",
    });

    // remove click listener on the trash icon
    pubsub.publish("deleteEventListener", {
      element: this.element.trashTag,
      type: "click",
    });
    this.listenersActive = false;
  }

  // update the task status
  updateStatus() {
    this.isComplete = !this.isComplete;
    taskElement.updateStatus(this.element);
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

  set listenersActive(listenersActive) {
    this._listenersActive = listenersActive;
  }

  get listenersActive() {
    return this._listenersActive;
  }
}

export default Task;
