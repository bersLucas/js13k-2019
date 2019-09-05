const $html = document.documentElement;
const $container = document.querySelector('#container');
const $canvas = document.querySelector('canvas');
const ctx = $canvas.getContext('2d');
let enemies = [];
let paused = false;
const intervals = [];

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

let start = null;
const draw = (timestamp) => {
  $html.style.setProperty('--mouse-x', `${player.x}px`);
  $html.style.setProperty('--mouse-y', `${player.y}px`);

  const dt = timestamp - start;
  start = timestamp;

  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  enemies.forEach((enemy) => {
    enemy.move(dt);
  });

  if (!paused) requestAnimationFrame(draw);
};

const getOffscreenSpawn = (distance) => {
  const xDistance = Math.random() * (distance * 2) + -distance;
  const yDistance = Math.random() * (distance * 2) + -distance;
  return [
    xDistance > 0 ? (board.w / 2) + xDistance : -(board.w / 2) - xDistance,
    yDistance > 0 ? (board.h / 2) + yDistance : -(board.h / 2) - yDistance,
  ];
};

const init = () => {
  $html.style.setProperty('--board-w', `${board.w}px`);
  $html.style.setProperty('--board-h', `${board.h}px`);

  $canvas.width = board.w;
  $canvas.height = board.h;

  intervals.push(setInterval(() => {
    const enemyPosition = getOffscreenSpawn(100);

    enemies.push(new Enemy1(
      enemyPosition[0],
      enemyPosition[1],
      0.5,
    ));
  }, 50));
};

document.querySelector('#start').onclick = () => {
  document.body.requestPointerLock();
};

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement) {
    paused = false;
    $html.classList.add('ingame');
    init();
    draw();
  } else {
    $html.classList.remove('ingame');
    init();
    paused = true;
    intervals.forEach((interval) => {
      clearInterval(interval);
    });
    enemies = [];
  }
}, false);

// TODO: Import this
class Enemy1 {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.w = 10;
    this.h = 10;

    this.speed = speed;

    this.ctx = $canvas.getContext('2d');
    this.ctx.fillStyle = 'green';

    const angle = Math.atan2(player.y - this.y, player.x - this.x) * (180 / Math.PI);
    this.dir = {
      x: ((-1 * (angle ** 2)) / 16200) + 1,
      y: Math.sin(angle / (180 / Math.PI)),
    };

    this.target = {
      x: player.x,
      y: player.y,
    };
  }

  move(dt) {
    this.x += this.dir.x * (dt * this.speed);
    this.y += this.dir.y * (dt * this.speed);

    // if((this.x - this.w) <)

    if (this.x) {
      this.ctx.fillRect(this.x + (board.w / 2), this.y + (board.h / 2), this.w, this.h);
    }
  }

  remove() {
    enemies.splice(enemies.indexOf(this), 1);
  }
}
