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
  });
}

export { firstNumberChange, secondNumberChange };
