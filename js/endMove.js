import globalData from './global.js';
import dragMoveHandler from './move.js';
import {
  firstNumberChange,
  secondNumberChange,
  detectedEmptyUl,
} from './util.js';

function dragEndHandler(e) {
  e.preventDefault();

  globalData.moveStart = false; // Перемещение законченно

  console.log('TARGET STOP');
  insertDraggableElement();

  // Удаляем пустой блок
  globalData.emptyBlock.remove();

  firstNumberChange();
  secondNumberChange();
  detectedEmptyUl();
  Object.assign(globalData.draggableElement.style, {
    position: 'inherit',
    zIndex: 'auto',
    transform: 'none',
    transition: 'transform 0.5s ease',
  });
  globalData.draggableElement.classList.remove('block__item-draggable');
  // Очищаем данные
  globalData.draggableElement = null;
  globalData.currentDropElement = null;
  globalData.emptyBlock = null;
  globalData.targetRelativePosition = null;
  globalData.currentDropElement = null;
  globalData.cursorStartPositionX = 0;
  globalData.cursorStartPositionY = 0;
  globalData.scrollDirectionTemp = null;
  globalData.currentDropParent = null;

  document.removeEventListener('mousemove', dragMoveHandler);
  // document.removeEventListener('mouseup', mouseDownHandler);
  document.removeEventListener('mouseup', dragEndHandler);
}

// Вставляем блок в dropzone выбранную
function insertDraggableElement() {
  const targetDataValue = globalData.currentDropElement?.dataset.emptyPos;

  if (targetDataValue === 'top') {
    const newElement = globalData.draggableElement;
    globalData.currentDropElement.after(newElement);
  }

  if (targetDataValue === 'left') {
    const newElement = globalData.draggableElement;
    const parent = globalData.currentDropElement.closest('.block__empty');
    // получаем родителя
    parent.after(newElement);
  }

  if (targetDataValue === 'right') {
    const draggableElement = globalData.draggableElement;
    const initiatorElement = globalData.currentDropParent;

    const nextSibling = initiatorElement.nextElementSibling.nextElementSibling;

    // Если следующего узла нет то это последний элемент в этом родителе
    // то создаем новый ul и вставляем после инициатора
    if (!nextSibling) {
      const newUlEl = createNewUlElement(draggableElement);
      globalData.currentDropParent.after(newUlEl);
      return;
    }
    const nextSiblingName = nextSibling.nodeName.toLowerCase();

    // Проверяем есть ли вложенные <ul>
    if (nextSiblingName === 'ul') {
      nextSibling.firstChild.before(draggableElement);
      return;
    }

    // Если следующий такой же пункт списка
    if (nextSiblingName === 'li') {
      const newUlEl = createNewUlElement(draggableElement);
      initiatorElement.insertAdjacentElement('afterend', newUlEl);
      // nextSibling.firstChild.beforebegin(newUlEl);
      return;
    }
  }
}
function createNewUlElement(currentElement) {
  const newUl = document.createElement('ul');
  newUl.appendChild(currentElement);
  return newUl;
}

export default dragEndHandler;
