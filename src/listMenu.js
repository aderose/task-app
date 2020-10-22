import pubsub from "./pubsub";

const listMenu = (doc) => {
  const _container = doc.querySelector(".list-selection-container");
  const _menu = doc.querySelector(".list-selection-container ul");
  const _close = doc.querySelector(".select-close");

  // listen for click on close button
  pubsub.publish("closeListListener", _close);

  // hide menu if the cross button is pressed
  pubsub.subscribe("hideSelection", _hideMenu);

  // hide the active menu
  function _hideMenu() {
    toggle();
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

  return { render, toggle };
};

export default listMenu;
