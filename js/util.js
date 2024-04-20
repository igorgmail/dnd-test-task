import globalData from './global.js';

// variant TOP | BOTTOM
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
  // globalData.draggableElement.parentNode.insertBefore(
  //   globalData.emptyBlock,
  //   globalData.draggableElement
  // );
}

function createInsideBlock() {
  const blockLeft = document.createElement('div');
  const blockRight = document.createElement('div');

  // blockLeft.innerHTML = `<span>LEFT</span>`;
  // blockRight.innerHTML = `<span>RIGHT</span>`;

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
  // if (!dropElement.classList.contains('block__empty__item')) {
  //   globalData.currentDropElement?.classList.remove('below-block');
  //   globalData.currentDropElement = null;
  // }

  // Нашли подходящий блок
  if (belowElement.hasAttribute('data-empty-pos')) {
    if (globalData.currentDropElement !== belowElement) {
      globalData.currentDropElement?.classList.remove('below-block');
      globalData.currentDropElement = belowElement;

      globalData.currentDropElement.classList.add('below-block');
    }
  }
}

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

function moveItemUp() {
  const target = globalData.targetItem;
  globalData.targetItem.classList.add('animate-up');
  setTimeout(() => {
    target.classList.remove('animate-up');
  }, 550);
}

function firstNumberChange() {
  const allLiElements = document.querySelectorAll('[data-draggable]');

  allLiElements.forEach((el, ind) => {
    const numberElement = el.firstElementChild;
    if (numberElement) {
      numberElement.textContent = ind + 1;
    }
  });
}

function nestingLevelCalculate(liElement) {
  let level = 0;
  let parentElement = liElement.parentNode;
  while (!parentElement.hasAttribute('data-draggable-container')) {
    if (parentElement && parentElement.nodeName.toLowerCase() === 'ul') {
      level++;
      parentElement = parentElement.parentNode;
    }
  }
  return level;
}

function secondNumberChange() {
  const allLiElements = document.querySelectorAll(
    '[data-draggable-container] li'
  );

  const allLevels = [];
  let previousOrderValue;
  let currentOrderValue;

  allLiElements.forEach((el, ind, arrNodes) => {
    if (ind === 0) {
      el.setAttribute('data-level', 1);
      allLevels[0] = 1;
      return;
    }

    let level = nestingLevelCalculate(el);

    let previousElement = arrNodes[ind - 1]; // Предыдущий элемент
    let orderPreviousElement = nestingLevelCalculate(previousElement);

    if (allLevels.length < level) {
      allLevels.push(1);
      currentOrderValue = 1;
    }

    if (orderPreviousElement + 1 === level) {
      allLevels[level - 1] = 1; // начало вложенного дерева
      currentOrderValue = 1;
    } else {
      previousOrderValue = allLevels[level - 1]; // Значение предыдущего элемента из массива по индексу
      currentOrderValue = previousOrderValue + 1; // Порядковое значение текущего элемента
      allLevels[level - 1] = currentOrderValue; // Ложим текущее в массив
    }

    // Вывод в элемент
    const resultString = allLevels.slice(0, level).join('.');
    el.lastElementChild.textContent = resultString;
    el.setAttribute('data-level', level);

    console.log('Level->', level);
    console.log('▶ ⇛ allLevels:', allLevels);
  });
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

// NOTE тестовая для объединения блоков для dnd
function getAllChildrenTree(element) {
  const container = document.querySelector('[data-draggable-container]');
  const nextElement = element.nextElementSibling;
  console.log('▶ ⇛ nextElement:', nextElement);

  const box = document.createElement('div');
  // const box = document.createDocumentFragment();
  box.classList.add('block__item');
  box.setAttribute('data-draggable', '');
  box.insertAdjacentElement('afterbegin', element);
  // box.appendChild(nextElement);
  box.insertAdjacentElement('afterend', nextElement);
  container.appendChild(box);

  console.log('▶ ⇛ box:', box);
  return box;
}

export {
  createEmptyBlock,
  updatePosition,
  addClassToDropElement,
  directionScrollMove,
  moveItemDown,
  moveItemUp,
  firstNumberChange,
  secondNumberChange,
  detectedEmptyUl,
  getAllChildrenTree,
};
