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

  blockLeft.innerHTML = `<span>LEFT</span>`;
  blockRight.innerHTML = `<span>RIGHT</span>`;

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
function secondNumberChange() {
  function getNestedLevel(liElement) {
    // console.log('▶ ⇛ liElement:', liElement);
    let level = 0;
    // const result = liElement.parentElement;
    // const result2 = result.parentElement;
    // console.log('CLOSEST-1', result);
    // console.log('CLOSEST-2', result2);

    let parentElement = liElement.parentElement;
    // console.log('▶ ⇛ parentElement:', parentElement.nodeName.toLowerCase());

    while (parentElement.nodeName.toLowerCase() === 'ul') {
      level++;
      if (parentElement.nodeName.toLowerCase() === 'li') {
      }
      parentElement = parentElement.parentElement;
    }

    // console.log('▶ ⇛ level:', level);
    return level;
  }

  const allLiElements = document.querySelectorAll('[data-draggable]');
  allLiElements.forEach((liElement) => {
    const level = getNestedLevel(liElement);
    // console.log(
    //   `Уровень вложенности для элемента ${liElement.textContent.trim()}: ${level}`
    // );
  });
}

function detectedEmptyUl() {
  // Находим родительский <ul>
  const parentUl = document.querySelector('.block__container > ul');

  if (parentUl.children.length <= 1) {
    // Находим вложенный <ul>
    const nestedUl = parentUl.querySelector('ul');

    // Находим дочерние <li> во вложенном <ul>
    const nestedLiElements = nestedUl.querySelectorAll('li');

    // Добавляем каждый дочерний <li> к родительскому <ul>
    nestedLiElements.forEach((liElement) => {
      parentUl.appendChild(liElement);
    });

    // Удаляем вложенный <ul>
    parentUl.removeChild(nestedUl);
  }
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
};
