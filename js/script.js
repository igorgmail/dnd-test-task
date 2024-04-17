import globalData from './global.js';
import dragMoveHandler from './move.js';
import { createEmptyBlock } from './util.js';
/* eslint-disable no-use-before-define */
const container = document.querySelector('.block__container');
const allBlocks = container.querySelectorAll('.block__item');

const mouseDownHandler = (e) => {
  e.preventDefault();

  const element = e.target.closest('.block__item');
  if (!element.hasAttribute('data-draggable')) return;

  globalData.cursorStartPositionX = e.clientX;
  globalData.cursorStartPositionY = e.clientY;

  globalData.draggableElement = element;

  // Позиция выбранного элемента относительна левого верхнего угла viewport
  const rect = globalData.draggableElement.getBoundingClientRect();
  let chooseElementLeft = rect.left;
  let chooseElementTop = rect.top;

  // Размеры элемента
  globalData.chooseElementSize = {
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };

  Object.assign(globalData.draggableElement.style, {
    position: 'absolute',
    left: `${chooseElementLeft}px`,
    top: `${chooseElementTop}px`,
    zIndex: 'auto',
    transform: 'none',
    backgroundColor: 'white',
    transition: 'none',
  });
  // создаем и вставляем пустой блок по переданным размерам
  const startEmptyBlock = createEmptyBlock(globalData.chooseElementSize);
  globalData.draggableElement.before(startEmptyBlock);

  document.addEventListener('mousemove', dragMoveHandler);
  document.addEventListener('mouseup', dragEndHandler);
};

function dragEndHandler(e) {
  e.preventDefault();

  globalData.moveStart = false; // Перемещение законченно

  const element = e.target;
  console.log('TARGET STOP');
  console.log(globalData.currentDropElement?.dataset.emptyPos);
  insertDraggableElement();
  // TEST
  // let parentNode;
  // const targetDataValue = globalData.currentDropElement?.dataset.emptyPos;
  // if (targetDataValue === 'top') {
  //   parentNode = container;
  // }
  // if (targetDataValue === 'left') {
  //   parentNode = container.querySelector('.block__empty');
  // }
  // const replacedNode = parentNode.replaceChild(
  //   globalData.draggableElement,
  //   globalData.currentDropElement
  // );
  // TEST

  // Удаляем пустой блок
  globalData.emptyBlock.remove();

  Object.assign(globalData.draggableElement.style, {
    position: 'inherit',
    zIndex: 'auto',
    transform: 'none',
    backgroundColor: 'transparent',
    transition: 'transform 0.5s ease',
  });

  // Очищаем данные
  globalData.draggableElement = null;
  globalData.currentDropElement = null;
  globalData.emptyBlock = null;

  globalData.currentDropElement = null;
  globalData.cursorStartPositionX = 0;
  globalData.cursorStartPositionY = 0;

  document.removeEventListener('mousemove', dragMoveHandler);
  // document.removeEventListener('mouseup', mouseDownHandler);
  document.removeEventListener('mouseup', dragEndHandler);
}

allBlocks.forEach((el) => {
  const dragElement = el;
  dragElement.onmousedown = mouseDownHandler;
});

function insertDraggableElement() {
  console.log('Draggable element');
  console.log(globalData.draggableElement);
  console.log('Below element');
  console.log(globalData.currentDropElement);

  const targetDataValue = globalData.currentDropElement?.dataset.emptyPos;
  if (targetDataValue === 'top') {
    const newElement = globalData.draggableElement;
    globalData.currentDropElement.after(newElement);
  }

  if (targetDataValue === 'left') {
    const newElement = globalData.draggableElement;
    const parent = globalData.currentDropElement.closest('.block__empty');
    console.log('▶ ⇛ parent:', parent);
    // получаем родителя
    parent.after(newElement);
  }
}
