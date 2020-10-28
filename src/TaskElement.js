import { format } from 'date-fns';
import tagFactory from './tagFactory';

export default class TaskElement {
  constructor({ id, title, dueDate, priority, isComplete }) {
    this.id = id;
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isComplete = isComplete;
    this.editTag = TaskElement.createEditTag();
    this.trashTag = TaskElement.createTrashTag();
    this.controlsTag = this.createControlsTag();
    this.dateTag = this.createDateTag();
    this.headerTag = this.createHeaderTag();
    this.textTag = this.createTextTag();
    this.container = this.createContainer();
  }

  // create list element container
  createContainer() {
    const container = tagFactory.createTag('li', {
      id: this.id,
      class: `task ${this.priority}-priority`,
    });
    container.appendChild(this.headerTag);
    container.appendChild(this.textTag);
    return container;
  }

  createHeaderTag() {
    const tag = tagFactory.createTag('div', { class: 'task-header' });
    tag.appendChild(this.dateTag);
    tag.appendChild(this.controlsTag);
    return tag;
  }

  // create paragraph element containing the task-text
  createTextTag() {
    const tag = tagFactory.createTag('p', { class: 'task-text' }, this.title);
    if (this.isComplete) this.updateStatus();
    return tag;
  }

  // create a formatted date
  createDate() {
    return format(new Date(this.dueDate), 'HH:mm, EEE. do MMMM yyyy');
  }

  // create a div containing the formatted due date
  createDateTag() {
    return tagFactory.createTag(
      'div',
      { class: 'deadline' },
      this.createDate(),
    );
  }

  // create container for the task controls
  createControlsTag() {
    const tag = tagFactory.createTag('div', { class: 'controls' });
    tag.appendChild(this.editTag);
    tag.appendChild(this.trashTag);
    return tag;
  }

  // create an edit button
  static createEditTag() {
    const editTag = tagFactory
      .createTag('button')
      .appendChild(tagFactory.createTag('i', { class: 'far fa-edit' }));
    return editTag;
  }

  // create a trash button
  static createTrashTag() {
    const trashTag = tagFactory
      .createTag('button')
      .appendChild(tagFactory.createTag('i', { class: 'far fa-trash-alt' }));
    return trashTag;
  }

  // update the element title
  setTitle(title) {
    this.title = title;
    this.textTag.textContent = this.title;
  }

  // update the element due date
  setDueDate(date) {
    this.dueDate = date;
    this.dateTag.textContent = this.createDate();
  }

  // update the element priority
  setPriority(priority) {
    this.priority = priority;
    this.container.setAttribute('class', `task ${this.priority}-priority`);
  }

  // update the element status
  setStatus(isComplete) {
    this.isComplete = isComplete;
    this.textTag.classList.toggle('completed');
  }
}
