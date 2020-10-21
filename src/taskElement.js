import pubsub from "./pubsub";
import { format } from "date-fns";

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

  // create a div containing the task due date
  const _createDate = (date) => {
    const dueDate = date
      ? format(new Date(date), "HH:mm, EEE. do MMMM yyyy")
      : "";
    const dateTag = _createTag("div", { class: "deadline" }, dueDate);
    return dateTag;
  };

  const _createHeader = (task) => {
    const header = _createTag("div", { class: "task-header" });
    const dateTag = _createDate(task.dueDate);

    // append deadline and controls to header
    header.appendChild(dateTag);
    header.appendChild(_createControls(task));

    return { header, dateTag };
  };

  const createElement = (task) => {
    // create the task list element with the correct id and priority
    const container = _createTag("li", {
      id: task.id,
      class: `task ${task.priority}-priority`,
    });

    const textTag = _createTag("div", { class: "task-text" }, task.title);

    // listen for clicks on the task container
    pubsub.publish("createCompleteListener", { container, task });

    const { header, dateTag } = _createHeader(task);

    // populate element with a header and title
    container.appendChild(header);
    container.appendChild(textTag);

    return { container, textTag, dateTag };
  };

  // update the provided element's
  const updateTitle = (element, title) => {
    element.textTag.textContent = title;
  };

  // update the provided element's due date
  const updateDueDate = (element, dueDate) => {
    element.dateTag.textContent = _createDate(dueDate).textContent;
  };

  // update the provided element's priority
  const updatePriority = (element, priority) => {
    element.container.setAttribute("class", `task ${priority}-priority`);
  };

  const updateStatus = (element) => {
    element.textTag.classList.toggle("completed");
  };

  return {
    createElement,
    updateTitle,
    updateDueDate,
    updatePriority,
    updateStatus,
  };
})(document);

export default taskElement;
