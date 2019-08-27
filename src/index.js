const $html = document.documentElement;
const player = {
  x: 0,
  y: 0,
  click: false,
};
const board = {
  w: 420,
  h: 320,
};

document.addEventListener('mousemove', (e) => {
  if (player.click) {
    player.x += e.movementX / 7;
    player.y += e.movementY / 7;
  } else {
    player.x += e.movementX;
    player.y += e.movementY;
  }

  if (player.x > (board.w / 2)) player.x = board.w / 2;
  if (player.y > (board.h / 2)) player.y = board.h / 2;
  if (player.x < -(board.w / 2)) player.x = -board.w / 2;
  if (player.y < -(board.h / 2)) player.y = -board.h / 2;
});

document.addEventListener('mousedown', (e) => {
  player.click = true;
  $html.style.setProperty('--cursorScale', '0.5');
});

document.addEventListener('mouseup', (e) => {
  player.click = false;
  $html.style.setProperty('--cursorScale', '1');
});

const draw = () => {
  $html.style.setProperty('--mouse-x', `${player.x}px`);
  $html.style.setProperty('--mouse-y', `${player.y}px`);
  requestAnimationFrame(draw);
};

const init = () => {
  $html.style.setProperty('--board-w', `${board.w}px`);
  $html.style.setProperty('--board-h', `${board.h}px`);
};

document.querySelector('#start').onclick = () => {
  document.body.requestPointerLock();
  $html.classList.add('ingame');
  init();
  draw();
};
