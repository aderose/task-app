const taskElement = ((doc) => {
  // create html tag of provided type, given attributes and containing provided
  // textContent
  const _createTag = (type, attributes, textContent) => {
    const element = doc.createElement(type);
    if (attributes)
      Object.keys(attributes).forEach((key) => {
        element.setAttribute(key, attributes[key]);
      });
    if (textContent) element.textContent = textContent;
    return element;
  };

  const createElement = (task) => {
    const element = _createTag("li", {
      id: task.id,
      class: `task ${task.priority}-priority`,
    });

    // create sub-elements to populate task element
    const header = _createTag("div", { class: "task-header" });
    const deadline = _createTag("div", { class: "deadline" }, task.dueDate);
    const controls = _createTag("div", { class: "controls" });
    const edit = _createTag("button");
    const editImg = _createTag("i", { class: "far fa-edit" });
    const trash = _createTag("button");
    const trashImg = _createTag("i", { class: "far fa-trash-alt" });
    const taskText = _createTag("div", { class: "task-text" }, task.title);

    // combine sub-elements to create the task element
    edit.appendChild(editImg);
    trash.appendChild(trashImg);
    controls.appendChild(edit);
    controls.appendChild(trash);
    header.appendChild(deadline);
    header.appendChild(controls);
    element.appendChild(header);
    element.appendChild(taskText);

    return element;
  };

  return { createElement };
})(document);

export default taskElement;
