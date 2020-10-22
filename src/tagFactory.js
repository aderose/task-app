const tagFactory = ((doc) => {
  // get a html tag from the document given a class/id
  function getTagFromDoc(selector) {
    return doc.querySelector(selector);
  }

  // create a html tag given its type, attributes and content
  const createTag = (type, attributes, textContent) => {
    const tag = doc.createElement(type);
    if (attributes)
      Object.keys(attributes).forEach((key) => {
        tag.setAttribute(key, attributes[key]);
      });
    if (textContent) tag.textContent = textContent;
    return tag;
  };

  return { getTagFromDoc, createTag };
})(document);

export default tagFactory;
