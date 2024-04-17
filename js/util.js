import globalData from './global.js';

// variant TOP | BOTTOM
function createEmptyBlock(size, variant) {
  const newBlock = document.createElement('div');

  Object.assign(newBlock.style, {
    backgroundColor: 'white',
    width: `${size.width}px`,
    height: `${size.height}px`,
    // margin-bottom: 0.5em;
  });

  newBlock.classList.add('block__empty');
  if (variant === 'TOP') {
    newBlock.setAttribute('data-empty-pos', 'top');
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

  blockLeft.innerHTML = `<span class="yellow">LEFT</span>`;
  blockRight.innerHTML = `<span class="yellow">RIGHT</span>`;

  blockLeft.classList.add('block__empty__item');
  blockRight.classList.add('block__empty__item');

  blockLeft.setAttribute('data-empty-pos', 'left');
  blockRight.setAttribute('data-empty-pos', 'right');
  return [blockLeft, blockRight];
}

function updatePosition(x, y) {
  if (globalData.moveStart) {
    globalData.draggableElement.style.transform = `translate(${x}px, ${y}px)`;
  }
}

function addClassToDropElement(dropElement) {
  // перемещение есть но подходящего блока нет
  if (!dropElement.hasAttribute('data-empty-pos')) {
    globalData.currentDropElement?.classList.remove('below-block');
    globalData.currentDropElement = null;
  }
  // if (!dropElement.classList.contains('block__empty__item')) {
  //   globalData.currentDropElement?.classList.remove('below-block');
  //   globalData.currentDropElement = null;
  // }

  // Нашли подходящий блок
  if (dropElement.hasAttribute('data-empty-pos')) {
    console.log(dropElement.innerText);

    if (globalData.currentDropElement !== dropElement) {
      globalData.currentDropElement?.classList.remove('below-block');
      globalData.currentDropElement = dropElement;

      globalData.currentDropElement.classList.add('below-block');
    }
  }
  // if (dropElement.classList.contains('block__empty__item')) {
  //   console.log(dropElement.innerText);

  //   if (globalData.currentDropElement !== dropElement) {
  //     globalData.currentDropElement?.classList.remove('below-block');
  //     globalData.currentDropElement = dropElement;

  //     globalData.currentDropElement.classList.add('below-block');
  //   }
  // }
}
export { createEmptyBlock, updatePosition, addClassToDropElement };
