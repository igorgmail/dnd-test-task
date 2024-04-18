import globalData from './global.js';
import {
  updatePosition,
  addClassToDropElement,
  createEmptyBlock,
} from './util.js';

export default function dragMoveHandler(e) {
  const cursorClientX = e.pageX;
  const cursorClientY = e.pageY;

  // Позиция выбранного элемента относительна левого верхнего угла viewport
  const rect = globalData.draggableElement.getBoundingClientRect();
  let chooseElementLeft = rect.left;
  let chooseElementTop = rect.top;

  // Рассчитываем смещение курсора
  const shiftX = cursorClientX - globalData.cursorStartPositionX;
  const shiftY = cursorClientY - globalData.cursorStartPositionY;

  //  Первое перемещение, только начало движения
  if (!globalData.moveStart) {
    globalData.moveStart = true; // Перемещение начато
  }

  updatePosition(shiftX, shiftY);

  // Получаем элемент над которым находимся и тип элемента  'DRAGGABLE' | 'DROPZONE'
  const [variant, belowElement] = getBellowElement(globalData.draggableElement);
  console.log('▶ ⇛ variant:', variant);

  //  Если это первый элемент
  if (globalData.targetItem === null) {
    globalData.targetItem = belowElement;
  }

  globalData.targetItem = belowElement;

  // Если 'DRAGGABLE' то добавляем dropzone элемент
  if (variant === 'DRAGGABLE') {
    // Определяем куда добавить empty block (top | bottom)
    const relativePosition = getRelativePosition(
      globalData.draggableElement,
      belowElement
    );
    if (globalData.targetRelativePosition === null) {
      globalData.targetRelativePosition = relativePosition;
    }
    if (globalData.targetRelativePosition === relativePosition) return;
    globalData.targetRelativePosition = relativePosition;
    addDropZoneElement(relativePosition);
  }

  if (variant === 'DROPZONE') {
    // Навели на зону в которую можем опустить наш элемент
    // Добавляем класс элементу dropzone empty block
    addClassToDropElement(belowElement);
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

    // TODO  анимация дергается сделать определение движения сверху или снизу
    // TODO подходит курсор
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

  // NOTE если у нас появляется dropzone элемент сверху то в момент
  // NOTE опускания элемента мы получаем два элемента `findDraggableElement` и `findDropzoneElement`
  if (findDraggableElement && findDropzoneElement) {
    console.warn(
      'ОШИБКА найдены оба элемента findDraggableElement и findDropzoneElement'
    );
  }
  const variant = findDraggableElement
    ? 'DRAGGABLE'
    : findDropzoneElement
    ? 'DROPZONE'
    : null;
  const belowElement = findDropzoneElement || findDraggableElement;

  return [variant, belowElement];
}

// наш draggable элемент (больше выше) или (больше ниже) того что под ним
// под ним предполагается элемент `draggable`
function getRelativePosition(dragElement, belowElement) {
  if (!belowElement.hasAttribute('data-draggable')) return;
  if (dragElement === belowElement) return;
  const rectA = dragElement.getBoundingClientRect();
  const rectB = belowElement.getBoundingClientRect();
  const result = rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  return result ? 'TOP' : 'BOTTOM';
}
