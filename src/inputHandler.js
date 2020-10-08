import pubsub from "./pubsub";

// handle form input provided by the user
const inputHandler = (doc) => {
  const form = doc.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    pubsub.publish("addTask", new FormData(form).get("add"));
  });
};

export default inputHandler;
