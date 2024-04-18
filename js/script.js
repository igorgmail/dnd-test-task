import globalData from './global.js';
import dragMoveHandler from './move.js';
import { createEmptyBlock } from './util.js';
/* eslint-disable no-use-before-define */
const container = document.querySelector('[data-draggable-container]');
const allBlocks = container.querySelectorAll('[data-draggable]');

const mouseDownHandler = (e) => {
  e.preventDefault();

  const element = e.target.closest('[data-draggable]');
  if (!element.hasAttribute('data-draggable')) return;

  globalData.cursorStartPositionX = e.clientX;
  globalData.cursorStartPositionY = e.clientY;

  // Получаем инфо об элементе
  const [chooseElementSize, chooseElementPosition] =
    getInfoAboutElement(element);

  // Стили draggable элемента
  Object.assign(element.style, {
    position: 'absolute',
    left: `${chooseElementPosition.left}px`,
    top: `${chooseElementPosition.top}px`,
    zIndex: 'auto',
    transform: 'none',
    // backgroundColor: 'white',
    transition: 'none',
  });

  element.classList.add('block__item-draggable');

  // создаем и вставляем пустой блок(заглушка) по переданным размерам
  const startEmptyBlock = createEmptyBlock(chooseElementSize, 'STUB');
  element.before(startEmptyBlock);

  // сохраняем в global
  globalData.emptyBlock = startEmptyBlock;
  globalData.draggableElement = element;
  globalData.chooseElementSize = chooseElementSize;

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
    transition: 'transform 0.5s ease',
  });
  globalData.draggableElement.classList.remove('block__item-draggable');
  // Очищаем данные
  globalData.draggableElement = null;
  globalData.currentDropElement = null;
  globalData.emptyBlock = null;
  (globalData.targetRelativePosition = null),
    (globalData.currentDropElement = null);
  globalData.cursorStartPositionX = 0;
  globalData.cursorStartPositionY = 0;
  globalData.scrollDirectionTemp = null;

  document.removeEventListener('mousemove', dragMoveHandler);
  // document.removeEventListener('mouseup', mouseDownHandler);
  document.removeEventListener('mouseup', dragEndHandler);
}

allBlocks.forEach((el) => {
  const dragElement = el;
  dragElement.onmousedown = mouseDownHandler;
});

function getInfoAboutElement(element) {
  // Позиция выбранного элемента относительна левого верхнего угла viewport
  const rect = element.getBoundingClientRect();
  let position = {
    left: rect.left,
    top: rect.top,
  };

  // Размеры элемента
  const size = {
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };

  return [size, position];
}

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
