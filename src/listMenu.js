import pubsub from "./pubsub";
import tagFactory from "./tagFactory";

const listMenu = (() => {
  const _container = tagFactory.getTagFromDoc(".list-selection-container");
  const _menu = tagFactory.getTagFromDoc(".list-selection-container ul");
  const _close = tagFactory.getTagFromDoc(".close-select-list");
  let isActive = false;

  function init() {
    // hide the menu when the close button is clicked
    pubsub.publish("createEventListener", {
      element: _close,
      type: "click",
      fn: hide,
    });
  }

  // show the menu if it is currently hidden
  function show(items) {
    if (isActive) return;
    render(items);
    toggle();
    isActive = !isActive;
  }

  // hide the active menu
  function hide() {
    if (!isActive) return;
    toggle();
    isActive = !isActive;
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

  return { render, init, show, hide };
})();

export default listMenu;
