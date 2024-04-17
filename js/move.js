import globalData from './global.js';
import {
  updatePosition,
  addClassToDropElement,
  createEmptyBlock,
} from './util.js';

export default function dragMoveHandler(e) {
  const cursorClientX = e.pageX;
  const cursorClientY = e.pageY;
  // e.preventDefault();

  // Позиция выбранного элемента относительна левого верхнего угла viewport
  const rect = globalData.draggableElement.getBoundingClientRect();
  let chooseElementLeft = rect.left;
  let chooseElementTop = rect.top;

  // Расчитываем смещение курсора
  const shiftX = cursorClientX - globalData.cursorStartPositionX;
  const shiftY = cursorClientY - globalData.cursorStartPositionY;

  //  Первое перемещение, только начало движения
  if (!globalData.moveStart) {
    globalData.moveStart = true; // Перемещение начато
    // console.log('▶ ⇛ cursorClientX:', cursorClientX);
    // console.log('▶ ⇛ cursorClientY:', cursorClientY);

    // createEmptyBlock(size);

    // Object.assign(globalData.draggableElement.style, {
    //   // position: 'absolute',
    //   zIndex: 1000,
    //   width: `${globalData.draggableElement.offsetWidth}px`,
    //   height: `${globalData.draggableElement.offsetHeight}px`,
    //   backgroundColor: 'white',
    //   pointer: 'move',
    //   transition: 'none',
    // });
  }

  // наш draggable елемент больше выше или больше ниже того что под ним
  function getRelativePosition(dragElement, belowElement) {
    if (!belowElement.classList.contains('block__item')) return;
    // console.log('▶ ⇛ belowElement:', belowElement);
    const rectA = dragElement.getBoundingClientRect();
    const rectB = belowElement.getBoundingClientRect();
    const result = rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
    return result ? 'TOP' : 'BOTTOM';
  }

  updatePosition(shiftX, shiftY);
  // Получаем элемент над которым находимся
  const belowElement = getDropElement(globalData.draggableElement);
  globalData.targetItem = belowElement;
  // Определяем куда добавить empty block (top | bottom)
  const relativePosition = getRelativePosition(
    globalData.draggableElement,
    belowElement
  );

  if (relativePosition === 'TOP') {
    globalData.emptyBlock?.remove(); // Удаляем старый пустой блок
    globalData.emptyBlock = createEmptyBlock(
      globalData.chooseElementSize,
      'TOP'
    );
    globalData.targetItem.before(globalData.emptyBlock);

    // TODO  анимация дергается
    const target = globalData.targetItem;
    globalData.targetItem.classList.add('animate-up');
    setTimeout(() => {
      target.classList.remove('animate-up');
    }, 550);
  }

  if (relativePosition === 'BOTTOM') {
    globalData.emptyBlock?.remove(); // Удаляем старый пустой блок
    globalData.emptyBlock = createEmptyBlock(
      globalData.chooseElementSize,
      'BOTTOM'
    );
    globalData.targetItem.after(globalData.emptyBlock);
  }
  // Добавляем класс элементу empty block
  addClassToDropElement(belowElement);
}

function getDropElement(dragElement) {
  const rect = dragElement.getBoundingClientRect();
  // Ищем относительно середины перетаскиваемого элемента
  const coordinates = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };

  dragElement.hidden = true;

  const element = document.elementFromPoint(coordinates.x, coordinates.y);
  // console.log('▶ ⇛ BELOW element:', element);
  // console.log('▶ ⇛ coordinates.y:', coordinates.y);
  // console.log('▶ ⇛ coordinates.x:', coordinates.x);
  dragElement.hidden = false;
  return element;
}
