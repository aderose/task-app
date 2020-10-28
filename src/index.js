import formHandler from './formHandler';
import inputHandler from './inputHandler';
import listHandler from './listHandler';
import storageHandler from './storageHandler';

function handleDocument() {
  storageHandler();
  inputHandler();
  formHandler();
  listHandler();
}

window.addEventListener('load', handleDocument);
