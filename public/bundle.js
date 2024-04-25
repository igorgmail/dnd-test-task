(() => {
  'use strict';
  const t = {
    draggableElement: null,
    moveStart: !1,
    chooseElementSize: { width: 0, height: 0 },
    targetItem: null,
    targetRelativePosition: '',
    currentDropElement: null,
    currentDropParent: null,
    emptyBlock: null,
    cursorStartPositionX: 0,
    cursorStartPositionY: 0,
    scrollDirectionTemp: null,
    scrollDirection: '',
  };
  function e(e, n) {
    const r = document.createElement('div');
    if (
      (Object.assign(r.style, {
        width: `${e.width}px`,
        height: `${e.height}px`,
      }),
      r.classList.add('block__empty'),
      'STUB' === n && r.setAttribute('data-empty-pos', 'stub'),
      'TOP' === n &&
        (r.setAttribute('data-empty-pos', 'top'),
        r.setAttribute('data-dropzone', '')),
      'BOTTOM' === n)
    ) {
      const [t, e] = (function () {
        const t = document.createElement('div'),
          e = document.createElement('div');
        return (
          t.classList.add('block__empty__item'),
          e.classList.add('block__empty__item'),
          t.setAttribute('data-dropzone', ''),
          e.setAttribute('data-dropzone', ''),
          t.setAttribute('data-empty-pos', 'left'),
          e.setAttribute('data-empty-pos', 'right'),
          [t, e]
        );
      })();
      r.prepend(t, e);
    }
    return (t.emptyBlock = r), r;
  }
  function n(e) {
    e.hasAttribute('data-empty-pos') ||
      (t.currentDropElement?.classList.remove('below-block'),
      (t.currentDropElement = null)),
      e.hasAttribute('data-empty-pos') &&
        t.currentDropElement !== e &&
        (t.currentDropElement?.classList.remove('below-block'),
        (t.currentDropElement = e),
        t.currentDropElement.classList.add('below-block'));
  }
  function r(t) {
    const e = document.querySelectorAll('[data-draggable-container] li');
    if ('get' === t) return e.length;
    document.getElementById('amount-elements').textContent = e.length;
  }
  function o(r) {
    const o = r.pageX,
      l = r.pageY;
    t.scrollDirection = (function (e) {
      let n = '';
      return (
        null === t.scrollDirectionTemp && (t.scrollDirectionTemp = e.clientY),
        e.clientY > t.scrollDirectionTemp && (n = 'BOTTOM'),
        e.clientY < t.scrollDirectionTemp && (n = 'TOP'),
        (t.scrollDirectionTemp = e.clientY),
        n
      );
    })(r);
    const a = o - t.cursorStartPositionX,
      i = l - t.cursorStartPositionY;
    var c, s;
    t.moveStart || (t.moveStart = !0),
      (c = a),
      (s = i),
      t.moveStart &&
        (t.draggableElement.style.transform = `translate(${c}px, ${s}px)`);
    const [u, d] = (function (t) {
      const e = t.getBoundingClientRect(),
        n = { x: e.left + e.width / 2, y: e.top + e.height / 2 };
      t.hidden = !0;
      const r = document.elementsFromPoint(n.x, n.y),
        o = r.find((e) => e.hasAttribute('data-draggable') && e !== t),
        l = r.find((e) => e.hasAttribute('data-dropzone') && e !== t);
      t.hidden = !1;
      return [o ? 'DRAGGABLE' : l ? 'DROPZONE' : null, l || o];
    })(t.draggableElement);
    if (((t.targetItem = d), 'DRAGGABLE' === u)) {
      const r = (function (t, e) {
        if (e.hasAttribute('data-main')) return 'BOTTOM';
        if (!e.hasAttribute('data-draggable')) return;
        if (t === e) return;
        const n = t.getBoundingClientRect(),
          r = e.getBoundingClientRect();
        return n.top + n.height / 2 < r.top + r.height / 2 ? 'TOP' : 'BOTTOM';
      })(t.draggableElement, d);
      (t.targetRelativePosition = r),
        (function (n) {
          'TOP' === n &&
            (t.emptyBlock?.remove(),
            (t.emptyBlock = e(t.chooseElementSize, 'TOP')),
            t.targetItem.before(t.emptyBlock),
            'TOP' === t.scrollDirection &&
              (function () {
                const e = t.targetItem;
                t.targetItem.classList.add('animate-down'),
                  setTimeout(() => {
                    e.classList.remove('animate-down');
                  }, 550);
              })()),
            'BOTTOM' === n &&
              (t.emptyBlock?.remove(),
              (t.emptyBlock = e(t.chooseElementSize, 'BOTTOM')),
              t.targetItem.after(t.emptyBlock)),
            (t.currentDropParent = t.targetItem);
        })(r),
        n(d);
    }
    'DROPZONE' === u && n(d);
  }
  function l(t) {
    let e = 0,
      n = t.parentNode;
    for (; !n.hasAttribute('data-draggable-container'); )
      n && 'ul' === n.nodeName.toLowerCase() && (e++, (n = n.parentNode));
    return e;
  }
  function a(t) {
    const e = document.createElement('ul');
    return e.appendChild(t), e;
  }
  const i = function e(n) {
      n.preventDefault(),
        (t.moveStart = !1),
        (function () {
          const e = t.currentDropElement?.dataset.emptyPos;
          if ('top' === e) {
            const e = t.draggableElement;
            t.currentDropElement.after(e);
          }
          if ('left' === e) {
            const e = t.draggableElement;
            t.currentDropElement.closest('.block__empty').after(e);
          }
          if ('right' === e) {
            const e = t.draggableElement,
              n = t.currentDropParent,
              r = n.nextElementSibling.nextElementSibling;
            if (!r) {
              const n = a(e);
              return void t.currentDropParent.after(n);
            }
            const o = r.nodeName.toLowerCase();
            if ('ul' === o) return void r.firstChild.before(e);
            if ('li' === o) {
              const t = a(e);
              n.insertAdjacentElement('afterend', t);
            }
          }
        })(),
        t.emptyBlock.remove(),
        document.querySelectorAll('[data-draggable]').forEach((t, e) => {
          const n = t.firstElementChild;
          n && (n.textContent = e + 1);
        }),
        (function () {
          const t = document.querySelectorAll('[data-draggable-container] li'),
            e = [];
          let n, r;
          t.forEach((t, o, a) => {
            if (0 === o)
              return t.setAttribute('data-level', 1), void (e[0] = 1);
            let i = l(t),
              c = l(a[o - 1]);
            e.length < i && (e.push(1), (r = 1)),
              c + 1 === i
                ? ((e[i - 1] = 1), (r = 1))
                : ((n = e[i - 1]), (r = n + 1), (e[i - 1] = r));
            const s = e.slice(0, i).join('.');
            (t.lastElementChild.textContent = s),
              t.setAttribute('data-level', i);
          });
        })(),
        (function () {
          const t = document.querySelector('[data-draggable-container]'),
            e = t.querySelector('ul'),
            n = e.firstElementChild;
          if (1 === e.children.length && 'ul' === n.nodeName.toLowerCase()) {
            const n = e.querySelector('ul');
            t.insertAdjacentElement('afterbegin', n);
          }
          t.querySelectorAll('ul').forEach((t) => {
            0 === t.children?.length && t.remove();
          });
        })(),
        Object.assign(t.draggableElement.style, {
          position: 'inherit',
          zIndex: 'auto',
          transform: 'none',
          transition: 'transform 0.5s ease',
        }),
        t.draggableElement.classList.remove('block__item-draggable'),
        (t.draggableElement = null),
        (t.currentDropElement = null),
        (t.emptyBlock = null),
        (t.targetRelativePosition = null),
        (t.currentDropElement = null),
        (t.cursorStartPositionX = 0),
        (t.cursorStartPositionY = 0),
        (t.scrollDirectionTemp = null),
        (t.currentDropParent = null),
        document.removeEventListener('mousemove', o),
        document.removeEventListener('mouseup', e);
    },
    c = document
      .querySelector('[data-draggable-container]')
      .querySelectorAll('[data-draggable]'),
    s = (n) => {
      n.preventDefault();
      const r = n.target.closest('[data-draggable]');
      if (r.hasAttribute('data-main')) return;
      if (!r.hasAttribute('data-draggable')) return;
      (t.cursorStartPositionX = n.clientX),
        (t.cursorStartPositionY = n.clientY);
      const [l, a] = (function (t) {
        const e = t.getBoundingClientRect();
        let n = { left: e.left, top: e.top };
        return [
          { width: Math.round(e.width), height: Math.round(e.height) },
          n,
        ];
      })(r);
      Object.assign(r.style, {
        position: 'absolute',
        left: `${a.left}px`,
        top: `${a.top}px`,
        zIndex: 'auto',
        transform: 'none',
        transition: 'none',
      }),
        r.classList.add('block__item-draggable');
      const c = e(l, 'STUB');
      r.before(c),
        (t.emptyBlock = c),
        (t.draggableElement = r),
        (t.chooseElementSize = l),
        document.addEventListener('mousemove', o),
        document.addEventListener('mouseup', i);
    };
  r(),
    c.forEach((t) => {
      t.onmousedown = s;
    }),
    document
      .getElementById('add-button')
      .addEventListener('click', function () {
        if (r('get') >= 12) return void alert('12 максимум');
        const t = document.querySelector('[data-draggable-container]>ul'),
          e = t.querySelectorAll('li'),
          n = e[e.length - 1].cloneNode(!0);
        (n.onmousedown = s), t.insertAdjacentElement('beforeend', n), r();
      });
})();
