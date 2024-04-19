import globalData from './global.js';
import {
  updatePosition,
  addClassToDropElement,
  createEmptyBlock,
  directionScrollMove,
  moveItemDown,
} from './util.js';

export default function dragMoveHandler(e) {
  const cursorClientX = e.pageX;
  const cursorClientY = e.pageY;

  // определяем направление движения мыши , нужно для анимации (TOP | BOTTOM )
  globalData.scrollDirection = directionScrollMove(e);

  // Рассчитываем смещение курсора
  const shiftX = cursorClientX - globalData.cursorStartPositionX;
  const shiftY = cursorClientY - globalData.cursorStartPositionY;

  //  Первое перемещение, только начало движения
  if (!globalData.moveStart) {
    globalData.moveStart = true; // Перемещение начато
  }

  updatePosition(shiftX, shiftY);

  // Получаем элемент над которым находимся и тип элемента  'DRAGGABLE' | 'DROPZONE' либо [null, null]
  const [variant, belowElement] = getBellowElement(globalData.draggableElement);

  globalData.targetItem = belowElement;

  // Если 'DRAGGABLE' то добавляем dropzone элемент
  if (variant === 'DRAGGABLE') {
    // Определяем куда добавить empty block (top | bottom)
    const relativePosition = getRelativePosition(
      globalData.draggableElement,
      belowElement
    );

    globalData.targetRelativePosition = relativePosition;
    addDropZoneElement(relativePosition);
    addClassToDropElement(belowElement);
  }

  if (variant === 'DROPZONE') {
    // Навели на зону в которую можем опустить наш элемент
    // Добавляем класс элементу dropzone empty block
    addClassToDropElement(belowElement);
    // и ложим его в текущий возможный для drop - currentDropElement
  }
}

function addDropZoneElement(relativePosition) {
  if (relativePosition === 'TOP') {
    globalData.emptyBlock?.remove(); // Удаляем старый пустой блок
    globalData.emptyBlock = createEmptyBlock(
      globalData.chooseElementSize,
      'TOP'
    );
    globalData.targetItem.before(globalData.emptyBlock);
    // Animation
    if (globalData.scrollDirection === 'TOP') {
      moveItemDown();
    }
  }

  if (relativePosition === 'BOTTOM') {
    globalData.emptyBlock?.remove(); // Удаляем старый пустой блок
    globalData.emptyBlock = createEmptyBlock(
      globalData.chooseElementSize,
      'BOTTOM'
    );
    globalData.targetItem.after(globalData.emptyBlock);
  }
  globalData.currentDropParent = globalData.targetItem;
}

function getBellowElement(dragElement) {
  const rect = dragElement.getBoundingClientRect();

  // Получаем координаты элемента для поиска
  // Ищем относительно середины перетаскиваемого элемента
  const coordinates = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };

  dragElement.hidden = true;

  const allElements = document.elementsFromPoint(coordinates.x, coordinates.y);

  // Ищем draggable элементы
  const findDraggableElement = allElements.find(
    (element) =>
      element.hasAttribute('data-draggable') && element !== dragElement
  );

  // Ищем dropzone элементы
  const findDropzoneElement = allElements.find(
    (element) =>
      element.hasAttribute('data-dropzone') && element !== dragElement
  );
  dragElement.hidden = false;

  const variant = findDraggableElement
    ? 'DRAGGABLE'
    : findDropzoneElement
    ? 'DROPZONE'
    : null;

  // NOTE если у нас появляется dropzone элемент сверху то в момент
  // NOTE опускания элемента мы получаем два элемента `findDraggableElement` и `findDropzoneElement`
  // NOTE И возвращаем только `findDropzoneElement`

  const belowElement = findDropzoneElement || findDraggableElement;

  return [variant, belowElement];
}

// наш draggable элемент (больше выше) или (больше ниже) того что под ним
// под ним предполагается элемент `draggable`
function getRelativePosition(dragElement, belowElement) {
  if (belowElement.hasAttribute('data-main')) return 'BOTTOM';
  if (!belowElement.hasAttribute('data-draggable')) return;
  if (dragElement === belowElement) return;

  const rectA = dragElement.getBoundingClientRect();
  const rectB = belowElement.getBoundingClientRect();

  const result = rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;

  return result ? 'TOP' : 'BOTTOM';
}
