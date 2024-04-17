// global.js
const globalData = {
  draggableElement: null, // выбранные элемент
  moveStart: false, // начало перетаскивания
  chooseElementSize: { width: 0, height: 0 }, // размер выбранного элемента
  currentDropElement: null, // пустой placeholder куда поместиться элемент
  targetItem: null, // Элемент на который наводим наш drag item (draggableElement)

  emptyBlock: null,
  // requestId: undefined,
  // позиция курсора
  cursorStartPositionX: 0, // начальная позиция курсора (первый клик)
  cursorStartPositionY: 0,
};

export default globalData;
