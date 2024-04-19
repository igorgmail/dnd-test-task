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
  console.log(globalData.currentDropElement?.dataset.emptyPos);
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

  document.removeEventListener('mousemove', dragMoveHandler);
  // document.removeEventListener('mouseup', mouseDownHandler);
  document.removeEventListener('mouseup', dragEndHandler);
}

// Вставляем блок в dropzone выбранную
function insertDraggableElement() {
  console.log('Draggable element');
  console.log(globalData.draggableElement);
  console.log('currentDropElement element');
  console.log(globalData.currentDropElement);

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
}

export default dragEndHandler;
