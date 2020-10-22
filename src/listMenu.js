import pubsub from "./pubsub";

const listMenu = (doc) => {
  const _container = doc.querySelector(".list-selection-container");
  const _menu = doc.querySelector(".list-selection-container ul");
  const _close = doc.querySelector(".select-close");
  let isActive = false;

  // listen for click on close button
  pubsub.publish("closeListListener", _close);

  // hide menu if the cross button is pressed
  pubsub.subscribe("hideSelection", hide);

  // show the menu if it is currently hidden
  function show(items) {
    if (!isActive) {
      render(items);
      toggle();
      isActive = !isActive;
    }
  }

  // hide the active menu
  function hide() {
    if (isActive) {
      toggle();
      isActive = !isActive;
    }
  }

  // toggle visibility of the selection menu
  function toggle() {
    _container.classList.toggle("visible");
  }

  // append the passed lists to the menu container
  function render(lists) {
    _menu.innerHTML = "";
    lists.forEach((list) => _menu.appendChild(list.menuItem));
  }

  return { render, show, hide };
};

export default listMenu;
