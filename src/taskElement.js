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

  const _createControls = () => {
    // create individual control elements
    const controls = _createTag("div", { class: "controls" });
    const edit = _createTag("button").appendChild(
      _createTag("i", { class: "far fa-edit" })
    );
    const trash = _createTag("button").appendChild(
      _createTag("i", { class: "far fa-trash-alt" })
    );

    // call for click listeners to be added to the control buttons
    pubsub.publish("createEditListener", edit);
    pubsub.publish("createDeleteListener", trash);

    // append buttons to controls
    controls.appendChild(edit);
    controls.appendChild(trash);

    return controls;
  };

  const _createHeader = (task) => {
    const header = _createTag("div", { class: "task-header" });

    // append deadline and controls to header
    header.appendChild(_createTag("div", { class: "deadline" }, task.dueDate));
    header.appendChild(_createControls());

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

  return { createElement };
})(document);

export default taskElement;
