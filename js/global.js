// global.js
const globalData = {
  draggableElement: null, // выбранные элемент
  moveStart: false, // начало перетаскивания
  chooseElementSize: { width: 0, height: 0 }, // размер выбранного элемента

  targetItem: null, // Элемент на который наводим наш drag item (draggableElement)
  targetRelativePosition: '', // Позиция draggable элемента на target элементе TOP | BOTTOM
  currentDropElement: null, // пустой placeholder куда поместиться элемент (dropzone)

  emptyBlock: null,
  // requestId: undefined,
  // позиция курсора
  cursorStartPositionX: 0, // начальная позиция курсора (первый клик)
  cursorStartPositionY: 0,

  scrollDirectionTemp: null, // Переменная используется для определения направления движения курсора
  scrollDirection: '', // Направление движения курсора
};

export default globalData;
