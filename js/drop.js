function getDropElement(drugElement) {
  const rect = drugElement.getBoundingClientRect();

  const coordinates = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };

  drugElement.hidden = true;

  const element = document.elementFromPoint(coordinates.x, coordinates.y);
  // console.log('▶ ⇛ coordinates.y:', coordinates.y);
  // console.log('▶ ⇛ coordinates.x:', coordinates.x);
  drugElement.hidden = false;
  return element;
}
