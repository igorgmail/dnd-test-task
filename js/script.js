import globalData from './globalData.js';
import dragMoveHandler from './move.js';
import dragEndHandler from './endMove.js';
import { createEmptyBlock, amountOfElements } from './util.js';
/* eslint-disable no-use-before-define */
const container = document.querySelector('[data-draggable-container]');
const allBlocks = container.querySelectorAll('[data-draggable]');

const mouseDownHandler = (e) => {
  e.preventDefault();

  const element = e.target.closest('[data-draggable]');
  if (element.hasAttribute('data-main')) return;
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

amountOfElements();
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

// Добавление нового элемента
const addButton = document.getElementById('add-button');
addButton.addEventListener('click', addNewElement);

function addNewElement() {
  const amountElements = amountOfElements('get');
  if (amountElements >= 12) {
    alert('12 максимум');
    return;
  }
  const container = document.querySelector('[data-draggable-container]>ul');
  const elements = container.querySelectorAll('li');
  const tempElement = elements[elements.length - 1];
  const newElement = tempElement.cloneNode(true);
  newElement.onmousedown = mouseDownHandler;
  container.insertAdjacentElement('beforeend', newElement);
  amountOfElements();
}
