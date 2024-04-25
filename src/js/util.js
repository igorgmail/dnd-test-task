import globalData from './globalData.js';

// получаем variant TOP | BOTTOM
// Создаем dropzone элемент
function createEmptyBlock(size, variant) {
  const newBlock = document.createElement('div');

  Object.assign(newBlock.style, {
    // backgroundColor: 'white',
    width: `${size.width}px`,
    height: `${size.height}px`,
    // margin-bottom: 0.5em;
  });

  newBlock.classList.add('block__empty');

  if (variant === 'STUB') {
    newBlock.setAttribute('data-empty-pos', 'stub');
  }
  if (variant === 'TOP') {
    newBlock.setAttribute('data-empty-pos', 'top');
    newBlock.setAttribute('data-dropzone', '');
  }
  if (variant === 'BOTTOM') {
    const [leftBlock, rightBlock] = createInsideBlock();
    newBlock.prepend(leftBlock, rightBlock);
  }
  globalData.emptyBlock = newBlock;
  return newBlock;
}

function createInsideBlock() {
  const blockLeft = document.createElement('div');
  const blockRight = document.createElement('div');

  blockLeft.classList.add('block__empty__item');
  blockRight.classList.add('block__empty__item');

  blockLeft.setAttribute('data-dropzone', '');
  blockRight.setAttribute('data-dropzone', '');

  blockLeft.setAttribute('data-empty-pos', 'left');
  blockRight.setAttribute('data-empty-pos', 'right');
  return [blockLeft, blockRight];
}

function updatePosition(x, y) {
  if (globalData.moveStart) {
    globalData.draggableElement.style.transform = `translate(${x}px, ${y}px)`;
  }
}

// TODO убрать логику оставить только добавление класса
function addClassToDropElement(belowElement) {
  // перемещение есть но подходящего блока нет
  if (!belowElement.hasAttribute('data-empty-pos')) {
    globalData.currentDropElement?.classList.remove('below-block');
    globalData.currentDropElement = null;
  }

  // Нашли подходящий блок
  if (belowElement.hasAttribute('data-empty-pos')) {
    if (globalData.currentDropElement !== belowElement) {
      globalData.currentDropElement?.classList.remove('below-block');
      globalData.currentDropElement = belowElement;

      globalData.currentDropElement.classList.add('below-block');
    }
  }
}

// Определяем направление движения мыши нужно для анимации
function directionScrollMove(event) {
  let direction = '';

  if (globalData.scrollDirectionTemp === null) {
    globalData.scrollDirectionTemp = event.clientY;
  }

  if (event.clientY > globalData.scrollDirectionTemp) {
    direction = 'BOTTOM';
  }
  if (event.clientY < globalData.scrollDirectionTemp) {
    direction = 'TOP';
  }
  globalData.scrollDirectionTemp = event.clientY;

  return direction;
}

function moveItemDown() {
  const target = globalData.targetItem;
  globalData.targetItem.classList.add('animate-down');
  setTimeout(() => {
    target.classList.remove('animate-down');
  }, 550);
}

// NOTE Не используется
function moveItemUp() {
  const target = globalData.targetItem;
  globalData.targetItem.classList.add('animate-up');
  setTimeout(() => {
    target.classList.remove('animate-up');
  }, 550);
}

function detectedEmptyUl() {
  // Находим родительский <ul>
  const container = document.querySelector('[data-draggable-container]');
  const parentUl = container.querySelector('ul');
  const childrenUl = parentUl.firstElementChild;

  if (
    parentUl.children.length === 1 &&
    childrenUl.nodeName.toLowerCase() === 'ul'
  ) {
    // Находим вложенный <ul>
    const nestedUl = parentUl.querySelector('ul');
    container.insertAdjacentElement('afterbegin', nestedUl);
  }

  const allUlElements = container.querySelectorAll('ul');

  allUlElements.forEach((el) => {
    if (el.children?.length === 0) {
      el.remove();
    }
  });
}

function amountOfElements(stat) {
  const allLi = document.querySelectorAll('[data-draggable-container] li');
  if (stat === 'get') {
    return allLi.length;
  }
  const amountSpan = document.getElementById('amount-elements');
  amountSpan.textContent = allLi.length;
  return;
}
export {
  createEmptyBlock,
  updatePosition,
  addClassToDropElement,
  directionScrollMove,
  moveItemDown,
  moveItemUp,
  detectedEmptyUl,
  amountOfElements,
};
