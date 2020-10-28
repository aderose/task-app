import pubsub from './pubsub';

function storageHandler() {
  const storage = JSON.parse(localStorage.getItem('data'));

  // update the localstorage data
  function updateStorage(data) {
    localStorage.setItem('data', JSON.stringify(data));
  }

  // publish a storage retrieved event with the retrieved storage
  function getStorage() {
    pubsub.publish('storageRetrieved', storage);
  }

  pubsub.subscribe('updateStorage', updateStorage);
  pubsub.subscribe('getStorage', getStorage);
}

export default storageHandler;
