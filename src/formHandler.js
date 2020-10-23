import pubsub from "./pubsub";
import tagFactory from "./tagFactory";

const formHandler = () => {
  const formContainer = tagFactory.getTagFromDoc(".form-container");
  const form = tagFactory.getTagFromDoc(".add-task-form");
  const formHeader = tagFactory.getTagFromDoc(".form-header");
  const submit = tagFactory.getTagFromDoc("#add");
  const cancel = tagFactory.getTagFromDoc("#cancel");

  // call submit form function when the form is submitted
  pubsub.publish("createEventListener", {
    element: form,
    type: "submit",
    fn: (e) => {
      e.preventDefault();
      submitForm();
    },
  });

  // toggle form visibility if the cancel button is pressed
  pubsub.publish("createEventListener", {
    element: cancel,
    type: "click",
    fn: toggleForm,
  });

  // show form when either the add task or edit task button is clicked
  pubsub.subscribe("addTaskClicked", showForm);
  pubsub.subscribe("openEditForm", editForm);

  // gather input and hide form when it is submitted
  function submitForm() {
    gatherInput(form);
    toggleForm();
  }

  // gather task information from the form
  function gatherInput(form) {
    const formData = new FormData(form);
    const taskInfo = {
      title: formData.get("title"),
      datetime: formData.get("datetime"),
      priority: formData.get("priority"),
    };

    // publish respective event based on submit type
    if (submit.value === "Add") pubsub.publish("createTask", taskInfo);
    if (submit.value === "Edit")
      pubsub.publish("updateTask", { id: Number(form.id), taskInfo });
  }

  function showForm() {
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
