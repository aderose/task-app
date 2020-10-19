import pubsub from "./pubsub";

const formHandler = (doc) => {
  const formContainer = doc.querySelector(".form-container");
  const form = formContainer.childNodes[1];
  const formHeader = form.childNodes[1];
  const add = doc.querySelector(".add");
  const submit = form.childNodes[15].childNodes[1];
  const cancel = doc.querySelector("#cancel");

  // add listeners to the form, add and cancel buttons through inputHandler
  pubsub.publish("createFormListener", form);
  pubsub.publish("createAddListener", add);
  pubsub.publish("createCancelListener", cancel);

  // subscribe to all form events
  pubsub.subscribe("addForm", addForm);
  pubsub.subscribe("editForm", editForm);
  pubsub.subscribe("submitForm", submitForm);
  pubsub.subscribe("cancelForm", toggleForm);

  function submitForm({ submitType }) {
    gatherInput(form, submitType);
    toggleForm();
    form.reset();
  }

  function gatherInput(form, submitType) {
    // gather task information from the form
    const formData = new FormData(form);
    const taskInfo = {
      title: formData.get("title"),
      datetime: formData.get("datetime-local"),
      priority: formData.get("priority"),
    };

    // publish respective event based on submit type
    if (submitType === "Add") pubsub.publish("addTask", taskInfo);
    if (submitType === "Edit") pubsub.publish("editTask", taskInfo);
  }

  function addForm() {
    // set form header and button values
    formHeader.textContent = "Add Task";
    submit.value = "Add";

    // toggle form visibility
    toggleForm();
  }

  function editForm(task) {
    // set form header and button values
    formHeader.textContent = "Edit Task";
    submit.value = "Edit";

    // set form values to current task values
    form["title"].value = task.title;
    form["datetime-local"].value = task.dueDate;
    form["priority"].value = task.priority;

    // toggle form visibility
    toggleForm();
  }

  function toggleForm() {
    formContainer.classList.toggle("visible");
  }
};

export default formHandler;
