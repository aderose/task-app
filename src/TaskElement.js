class TaskElement {
  constructor(doc, task) {
    this.doc = doc;
    this.task = task;
  }

  _createSubElement(elementType, classes, innerText, id) {
    const element = this.doc.createElement(elementType);
    if (classes) classes.forEach((c) => element.classList.add(c));
    if (innerText) element.textContent = innerText;
    if (id) element.id = id;
    return element;
  }

  getTaskElement() {
    const taskElement = this._createSubElement(
      "li",
      ["task", `${this.task.priority}-priority`],
      "",
      this.task.id
    );
    const header = this._createSubElement("div", ["task-header"]);
    const deadline = this._createSubElement(
      "div",
      ["deadline"],
      this.task.dueDate
    );
    const controls = this._createSubElement("div", ["controls"]);
    const edit = this._createSubElement("button");
    const editImg = this._createSubElement("i", ["far", "fa-edit"]);
    const trash = this._createSubElement("button");
    const trashImg = this._createSubElement("i", ["far", "fa-trash-alt"]);
    const taskText = this._createSubElement(
      "div",
      ["task-text"],
      this.task.title
    );
    edit.appendChild(editImg);
    trash.appendChild(trashImg);
    controls.appendChild(edit);
    controls.appendChild(trash);
    header.appendChild(deadline);
    header.appendChild(controls);
    taskElement.appendChild(header);
    taskElement.appendChild(taskText);

    return taskElement;
  }
}

export default TaskElement;
