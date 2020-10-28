import pubsub from './pubsub';
import TaskElement from './TaskElement';

class Task {
  constructor(
    id,
    title = '',
    dueDate = '',
    priority = 'Low',
    isComplete = false,
  ) {
    this.id = id;
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isComplete = isComplete;
    this.element = new TaskElement(this);
    this.listenersActive = false;
  }

  // set up event listeners on the task element
  addEventListeners() {
    if (this.listenersActive) return;
    // update the task status when the element is clicked
    pubsub.publish('createEventListener', {
      element: this.element.container,
      type: 'click',
      fn: this.updateStatus.bind(this),
    });

    // edit this task
    pubsub.publish('createEventListener', {
      element: this.element.editTag,
      type: 'click',
      fn: (e) => {
        // open the edit task form
        pubsub.publish('updateTaskFormOpen', this);
        e.stopPropagation();
      },
    });

    // delete this task
    pubsub.publish('createEventListener', {
      element: this.element.trashTag,
      type: 'click',
      fn: (e) => {
        pubsub.publish('deleteTask', this);
        e.stopPropagation();
      },
    });
    this.listenersActive = true;
  }

  // remove event listeners from the task element
  removeEventListeners() {
    if (!this.listenersActive) return;
    // remove click listener on the container
    pubsub.publish('deleteEventListener', {
      element: this.element.container,
      type: 'click',
    });

    // // remove click listener on the edit icon
    pubsub.publish('deleteEventListener', {
      element: this.element.editTag,
      type: 'click',
    });

    // remove click listener on the trash icon
    pubsub.publish('deleteEventListener', {
      element: this.element.trashTag,
      type: 'click',
    });
    this.listenersActive = false;
  }

  // update the task status
  updateStatus() {
    this.isComplete = !this.isComplete;
    this.element.setStatus(this.isComplete);
    // called so we can update local storage
    pubsub.publish('taskListUpdated');
  }

  setTitle(title) {
    this.title = title;
    // update title element with new title on update
    if (this.element) this.element.setTitle(title);
  }

  setDueDate(dueDate) {
    this.dueDate = dueDate;
    // update dueDate element with new dueDate on update
    if (this.element) this.element.setDueDate(dueDate);
  }

  setPriority(priority) {
    this.priority = priority;
    // update priority styling with new priority on update
    if (this.element) this.element.setPriority(priority);
  }
}

export default Task;
