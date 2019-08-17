let activeTiles = [];
let $rows = [];

class Tile {
  constructor(elem, rowIndex, colIndex) {
    this.elem = elem;
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.value = {
      r: Math.ceil(Math.random() * 255),
      g: Math.ceil(Math.random() * 255),
      b: Math.ceil(Math.random() * 255),
    };
  }

  updateColor() {
    ['backgroundColor', 'color'].forEach((cssRule) => {
      this.elem.style[cssRule] = `rgba(${Object.entries(this.value).map((v) => v[1]).join(',')})`;
    });
  }
}

const moveTiles = (tiles) => {
  const rects = [];
  [0, 1].forEach((index) => {
    rects.push(tiles[index].elem.getBoundingClientRect());
    if (tiles[index].elem.style.transform.includes('translate')) {
      rects[index].x += tiles[index].elem.style.transform.split(/translate\(|,|\)/g)[2].slice(0, -2);
      rects[index].y += tiles[index].elem.style.transform.split(/translate\(|,|\)/g)[3].slice(0, -2);
    }
  });

  tiles[0].elem.style.transform = `translate(${rects[1].x - rects[0].x}px, ${rects[1].y - rects[0].y}px)`;
  tiles[1].elem.style.transform = `translate(${rects[0].x - rects[1].x}px, ${rects[0].y - rects[1].y}px)`;
};

const swapTiles = () => {
  [0, 1].forEach((activeTileIndex) => {
    activeTiles[activeTileIndex].elem.classList.remove('active');
  });
  moveTiles(activeTiles);
};

const setActive = (tile) => {
  if (tile.active) {
    activeTiles.splice(activeTiles.indexOf(tile));
  } else {
    activeTiles.push(tile);
  }

  tile.active = !tile.active;
  tile.elem.classList.toggle('active');

  if (activeTiles.length > 1) {
    swapTiles();
    activeTiles = [];
  }
};

window.onload = () => {
  $rows = Array.from(document.querySelectorAll('.row'))
    .map((row, rowIndex) => ({
      elem: row,
      cols: Array.from(row.querySelectorAll('.col .tile'))
        .map((col, colIndex) => {
          const tile = new Tile(col, rowIndex, colIndex);
          tile.updateColor();
          col.onclick = () => {
            setActive(tile);
          };
          return tile;
        }),
    }));
};
