import tagFactory from "./tagFactory";
import pubsub from "./pubsub";

class Form {
  constructor({ type, containerName, formName, cancelName, headerName }) {
    this.type = type;
    this.container = tagFactory.getTagFromDoc(containerName);
    this.form = tagFactory.getTagFromDoc(formName);
    this.cancel = tagFactory.getTagFromDoc(cancelName);
    this.header = tagFactory.getTagFromDoc(headerName);
    this.fields = {};
    this.isActive = false;

    // populate fields with all form field IDs and their html tags
    Object.values(this.form).forEach(
      (field) => (this.fields[field.id] = field)
    );
  }

  // show the form with an optional set of default values
  show({ id = "", defaults = {} } = {}) {
    if (this.header)
      this.header.textContent = this.type.replace(/([A-Z])/, " $1");
    this.form.reset();
    this.form.setAttribute("id", `${this.type}-${id}`);
    Object.entries(defaults).forEach(([id, val]) => {
      this.fields[id].value = val;
    });
    this._toggle();
  }

  // hide the form
  hide() {
    this._toggle();
  }

  // listen for a form submission or an optional cancel
  _listen() {
    pubsub.publish("createEventListener", {
      element: this.form,
      type: "submit",
      fn: this._submit.bind(this),
    });

    if (!this.cancel) return;

    pubsub.publish("createEventListener", {
      element: this.cancel,
      type: "click",
      fn: this._toggle.bind(this),
    });
  }

  // stop listening for a form submission or cancel
  _stopListening() {
    pubsub.publish("deleteEventListener", {
      element: this.form,
      type: "submit",
    });

    if (!this.cancel) return;

    pubsub.publish("deleteEventListener", {
      element: this.cancel,
      type: "click",
    });
  }

  // publish a submission event for the form type and provide the gathered input
  _submit(e) {
    e.preventDefault();
    pubsub.publish(`${this.type}Submitted`, this._gatherInput());
    this._toggle();
  }

  // gather all form input values
  _gatherInput() {
    const input = { id: this._getId() };
    new FormData(this.form).forEach((val, key) => (input[key] = val));
    return input;
  }

  // get edit id from form, returns empty string if not an edit form
  _getId() {
    const str = this.form.id;
    return (str.match(/.*-(\d*)?$/) || [])[1] || "";
  }

  // toggle the form container visibility
  _toggle() {
    this.isActive = !this.isActive;
    // only listen for events if this form is active
    this.isActive ? this._listen() : this._stopListening();
    if (this.container) this.container.classList.toggle("visible");
  }
}

export default Form;
