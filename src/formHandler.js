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
    forms[`${formName}${type}`] = new Form({
      type,
      containerName,
      formName,
      cancelName,
      headerName,
    });
  }

  function showForm({ formName, type, id, defaults }) {
    if (forms[`${formName}${type}`])
      forms[`${formName}${type}`].show({ id, defaults });
  }

  function hideForm({ formName, type }) {
    if (forms[`${formName}${type}`]) forms[`${formName}${type}`].hide();
  }

  // create a form and store it in the forms object
  pubsub.subscribe('createForm', createForm);

  // show the form with the provided config
  pubsub.subscribe('showForm', showForm);

  // hide the form with the provided config
  pubsub.subscribe('hideForm', hideForm);
};

export default formHandler;
