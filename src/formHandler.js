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

  function submitForm() {
    gatherInput(form);
    toggleForm();
  }

  function gatherInput(form) {
    // gather task information from the form
    const formData = new FormData(form);
    const taskInfo = {
      title: formData.get("title"),
      datetime: formData.get("datetime"),
      priority: formData.get("priority"),
    };

    // publish respective event based on submit type
    if (submit.value === "Add") pubsub.publish("addTask", taskInfo);
    if (submit.value === "Edit")
      pubsub.publish("editTask", { id: form.id, taskInfo });
  }

  function addForm() {
    // reset previous form input
    form.reset();
    // set approprate form values
    formHeader.textContent = "Add Task";
    submit.value = "Add";

    // get rid of any old task edit ids
    form.setAttribute("id", "");

    // toggle form visibility
    toggleForm();
  }

  function editForm(task) {
    // reset previous form input
    form.reset();
    // set approprate form values
    formHeader.textContent = "Edit Task";
    submit.value = "Edit";

    // set form's id equal to the task ID so that we know which task to
    // edit when the form has been submitted
    form.setAttribute("id", task.id);

    // set form values to current task values
    form["title"].value = task.title;
    form["datetime"].value = task.dueDate;
    form["priority"].value = task.priority;

    // toggle form visibility
    toggleForm();
  }

  function toggleForm() {
    formContainer.classList.toggle("visible");
  }
};

export default formHandler;
