import pubsub from './pubsub';
import Form from './Form';

const formHandler = () => {
  const forms = {};

  function createForm({
    type,
    containerName,
    formName,
    cancelName,
    headerName,
  }) {
    forms[formName] = new Form({
      type,
      containerName,
      formName,
      cancelName,
      headerName,
    });
  }

  function showForm({ formName, id, defaults }) {
    if (forms[formName]) forms[formName].show({ id, defaults });
  }

  function hideForm({ formName }) {
    if (forms[formName]) forms[formName].hide();
  }

  // create a form and store it in the forms object
  pubsub.subscribe('createForm', createForm);

  // show the form with the provided config
  pubsub.subscribe('showForm', showForm);

  // hide the form with the provided config
  pubsub.subscribe('hideForm', hideForm);
};

export default formHandler;
