import { format } from "date-fns";
import tagFactory from "./tagFactory";

const taskElement = (() => {
  // create the task list element for the provided task
  const createElement = (task) => {
    const container = tagFactory.createTag("li", {
      id: task.id,
      class: `task ${task.priority}-priority`,
    });

    const textTag = tagFactory.createTag(
      "p",
      { class: "task-text" },
      task.title
    );

    // if the task is complete, strike through the text
    if (task.isComplete) textTag.classList.toggle("completed");

    const { headerTag, dateTag, editTag, trashTag } = _createHeader(task);

    // populate element with a header and title
    container.appendChild(headerTag);
    container.appendChild(textTag);

    return { container, textTag, dateTag, editTag, trashTag };
  };

  // create controls for each task element
  const _createControls = () => {
    const controlsTag = tagFactory.createTag("div", { class: "controls" });

    // create a edit button containing an edit icon
    const editTag = tagFactory
      .createTag("button")
      .appendChild(tagFactory.createTag("i", { class: "far fa-edit" }));

    // create a trash button containing a trash icon
    const trashTag = tagFactory
      .createTag("button")
      .appendChild(tagFactory.createTag("i", { class: "far fa-trash-alt" }));

    // append buttons to controls
    controlsTag.appendChild(editTag);
    controlsTag.appendChild(trashTag);

    return { controlsTag, editTag, trashTag };
  };

  // create the task element header which contains the due date and controls
  const _createHeader = (task) => {
    const headerTag = tagFactory.createTag("div", { class: "task-header" });
    const dateTag = _createDate(task.dueDate);
    const { controlsTag, editTag, trashTag } = _createControls(task);

    // append deadline and controls to header
    headerTag.appendChild(dateTag);
    headerTag.appendChild(controlsTag);

    return { headerTag, dateTag, editTag, trashTag };
  };

  // create a div containing the task due date
  const _createDate = (date) => {
    const dueDate = date
      ? format(new Date(date), "HH:mm, EEE. do MMMM yyyy")
      : "";
    const dateTag = tagFactory.createTag("div", { class: "deadline" }, dueDate);
    return dateTag;
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
})();

export default taskElement;
