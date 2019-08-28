const $html = document.documentElement;
const $container = document.querySelector('#container');

const modes = {
  1: {
    color: '#00adef',
  },
  2: {
    color: '#ff9dcc',
  },
  3: {
    color: '#ffff76',
  },
  4: {
    color: '#000',
  },
};

const player = {
  x: 0,
  y: 0,
  click: false,
  mode: modes[0],
};

const board = {
  w: 420,
  h: 320,
};

const ripple = () => {
  const elem = document.createElement('div');
  elem.className = 'ripple';
  elem.style.backgroundColor = player.mode.color;
  elem.style.transform = `translate(${player.x}px, ${player.y}px)`;
  setTimeout(() => {
    elem.remove();
  }, 500);
  return elem;
};

document.addEventListener('mousemove', (e) => {
  if (player.click) {
    player.x += e.movementX / 8;
    player.y += e.movementY / 8;
  } else {
    player.x += e.movementX / 1.5;
    player.y += e.movementY / 1.5;
  }

  if (player.x > (board.w / 2)) player.x = board.w / 2;
  if (player.y > (board.h / 2)) player.y = board.h / 2;
  if (player.x < -(board.w / 2)) player.x = -board.w / 2;
  if (player.y < -(board.h / 2)) player.y = -board.h / 2;
}, false);

document.addEventListener('mousedown', () => {
  player.click = true;
  $html.style.setProperty('--cursorScale', '0.5');
}, false);

document.addEventListener('mouseup', () => {
  player.click = false;
  $html.style.setProperty('--cursorScale', '1');
}, false);

document.addEventListener('keydown', (e) => {
  if (modes[e.key]) {
    player.mode = modes[e.key];
    $html.style.setProperty('--theme', player.mode.color);
    $container.appendChild(ripple());
  }
}, false);

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement) {
    $html.classList.add('ingame');
  } else {
    // $html.classList.remove('ingame');
  }
}, false);

let start = null;
const draw = (timestamp) => {
  $html.style.setProperty('--mouse-x', `${player.x}px`);
  $html.style.setProperty('--mouse-y', `${player.y}px`);

  const dt = timestamp - start;
  start = timestamp;

  enemies.forEach((enemy) => {
    enemy.move(dt);
  });
  requestAnimationFrame(draw);
};

const init = () => {
  $html.style.setProperty('--board-w', `${board.w}px`);
  $html.style.setProperty('--board-h', `${board.h}px`);

  const enemySpawnInterval = setInterval(() => {
    enemies.push(new Enemy(-200 + Math.ceil(Math.random() * 400), -200 + Math.ceil(Math.random() * 400), 5));
  }, 250);

  setTimeout(() => {
    clearInterval(enemySpawnInterval);
  }, 2000);
};

document.querySelector('#start').onclick = () => {
  document.body.requestPointerLock();
  init();
  draw();
};

// TODO: Import this
const enemies = [];

class Enemy {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    const elem = document.createElement('div');
    elem.className = 'enemy';
    elem.style.transform = `translate(${this.x}px, ${this.y}px)`;
    $container.appendChild(elem);
    this.elem = elem;

    this.rad = Math.atan2(this.y - player.y, this.x - player.x);
    elem.innerHTML = this.rad;
  }

  move(dt) {

  }
}
