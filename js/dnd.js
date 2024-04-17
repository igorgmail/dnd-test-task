const d = "dragging";

const container = document.getElementById("container");
const el = document.getElementById("drag");

var cOffX = 0;
var cOffY = 0;

el.addEventListener("mousedown", dragStart);

function dragStart(e) {
  e = e || window.event;
  e.preventDefault();

  cOffX = e.clientX - el.offsetLeft;
  cOffY = e.clientY - el.offsetTop;

  document.addEventListener("mousemove", dragMove);
  document.addEventListener("mouseup", dragEnd);

  el.classList.add(d);
  container.style.cursor = "move";
}

function dragMove(e) {
  e = e || window.event;
  e.preventDefault();

  el.style.top = (e.clientY - cOffY).toString() + "px";
  el.style.left = (e.clientX - cOffX).toString() + "px";
}

function dragEnd(e) {
  e = e || window.event;
  e.preventDefault();

  document.removeEventListener("mousemove", dragMove);
  document.removeEventListener("mouseup", dragEnd);

  el.classList.remove(d);
  container.style.cursor = null;
}
