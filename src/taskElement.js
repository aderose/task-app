import pubsub from "./pubsub";

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

  const _createControls = (task) => {
    // create individual control elements
    const controls = _createTag("div", { class: "controls" });
    const edit = _createTag("button").appendChild(
      _createTag("i", { class: "far fa-edit" })
    );
    const trash = _createTag("button").appendChild(
      _createTag("i", { class: "far fa-trash-alt" })
    );

    // call for click listeners to be added to the control buttons
    pubsub.publish("createEditListener", { task, edit });
    pubsub.publish("createDeleteListener", { task, trash });

    // append buttons to controls
    controls.appendChild(edit);
    controls.appendChild(trash);

    return controls;
  };

  const _createDate = (date) => {
    const dueDate = date ? new Date(date) : "";
    const timer = _createTag("div", { class: "deadline" }, dueDate);
    return timer;
  };

  const _createHeader = (task) => {
    const header = _createTag("div", { class: "task-header" });

    // append deadline and controls to header
    header.appendChild(_createDate(task.dueDate));
    header.appendChild(_createControls(task));

    return header;
  };

  const createElement = (task) => {
    // create the task list element with the correct id and priority
    const element = _createTag("li", {
      id: task.id,
      class: `task ${task.priority}-priority`,
    });

    // populate element with a header and title
    element.appendChild(_createHeader(task));
    element.appendChild(_createTag("div", { class: "task-text" }, task.title));

    return element;
  };

  // update the provided element's
  const updateTitle = (element, title) => {
    element.childNodes[1].textContent = title;
  };

  // update the provided element's due date
  const updateDueDate = (element, dueDate) => {
    element.childNodes[0].childNodes[0].textContent = _createDate(
      dueDate
    ).textContent;
  };

  // update the provided element's priority
  const updatePriority = (element, priority) => {
    element.setAttribute("class", `task ${priority.toLowerCase()}-priority`);
  };

  return { createElement, updateTitle, updateDueDate, updatePriority };
})(document);

export default taskElement;
