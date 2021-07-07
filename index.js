let mapHeight = 15;
let mapWidth = 30;
let bombNumber = 40;
let map = new Array(mapHeight);
let remainnigBombs;
let remainingClose;
let progress = 0;
let openColor = "#acb5bd";
let closeColor = "#6c757d";
let score = document.getElementById("score");
let difficulty = document.getElementById("difficulty");
window.addEventListener("contextmenu", e => e.preventDefault());

function startGame() {
  createTable();
  changeDifficulty();
  drawMap();
  setBombs();
  neighbours();
  resetButton();
}

function newGame() {
  resetMap();
  setBombs();
  neighbours();
  refresh();
}

function changeDifficulty() {
  difficulty.addEventListener("mousedown", function (e) {
    switch (bombNumber) {
      case 40:
        bombNumber = 60;
        break;
      case 60:
        bombNumber = 80;
        break;
      case 80:
        bombNumber = 100;
        break;
      case 100:
        bombNumber = 40;
        break;
    }
    newGame();
  });
}

function createTable() {
  for (i = 0; i < mapHeight; i++) {
    map[i] = new Array(mapWidth);
    for (j = 0; j < mapWidth; j++) {
      var p = {
        isOpen: "false",
        isBlocked: "false",
        n: "0",
        isClicked: "false"
      };
      map[i][j] = p;
    }
  }
}

function setBombs() {
  let remainnig = bombNumber;
  remainnigBombs = bombNumber;
  score.textContent = remainnigBombs;
  remainingClose = mapHeight * mapWidth - bombNumber;
  do {
    let x = parseInt(Math.random() * mapHeight);
    let y = parseInt(Math.random() * mapWidth);
    if (map[x][y].n == 0) {
      map[x][y].n = 9;
      remainnig--;
    }
  } while (remainnig > 0);
}

function neighbours() {
  for (i = 0; i < mapHeight; i++) {
    for (j = 0; j < mapWidth; j++) {
      if (map[i][j].n != 9) {
        borders(i + 1, j);
        borders(i - 1, j);
        borders(i, j + 1);
        borders(i, j - 1);
        borders(i + 1, j + 1);
        borders(i - 1, j + 1);
        borders(i - 1, j - 1);
        borders(i + 1, j - 1);
      }
    }
  }
}

function borders(x, y) {
  if (x >= 0 && x < mapHeight && y >= 0 && y < mapWidth) {
    if (map[x][y].n == 9) {
      map[i][j].n++;
    }
  }
}

function resetMap() {
  for (i = 0; i < mapHeight; i++) {
    for (j = 0; j < mapWidth; j++) {
      var p = {
        isOpen: "false",
        isBlocked: "false",
        n: "0"
      };
      map[i][j] = p;
      progress = 0;
    }
  }
}

function drawMap() {
  let container = document.createElement("div");
  let row = 0;
  container.className = "container-fluid";

  for (i = 0; i < mapHeight; i++) {

    row = document.createElement("div");
    row.className = "d-flex small";

    for (j = 0; j < mapWidth; j++) {
      let btn = document.createElement("BUTTON");
      btn.innerHTML;
      btn.id = "" + (i + j * 100);
      btn.textContent = ".";
      btn.className = "tile";
      btn.addEventListener("mousedown", function (e) {
        clickField(btn.id, e);
      });
      row.appendChild(btn);
    }
    container.appendChild(row);
  }
  document.body.appendChild(container);
}

function refresh() {
  for (i = 0; i < mapHeight; i++) {
    for (j = 0; j < mapWidth; j++) {
      let btn = document.getElementById("" + (i + j * 100));
      if (map[i][j].isOpen == "true" && map[i][j].isBlocked == "false") {
        if (map[i][j].n == 0) {
          btn.style.color = openColor;
          btn.style.backgroundColor = openColor;
          btn.textContent = ".";
        } else if (map[i][j].n == 9) {
          btn.style.backgroundColor = closeColor;
          btn.style.color = "black";
          btn.textContent = "B";
        } else {
          btn.textContent = map[i][j].n;
          changeColor(btn);
          btn.style.backgroundColor = openColor;
        }
      }
      if (map[i][j].isOpen == "false" && map[i][j].isBlocked == "false") {
        btn.style.backgroundColor = closeColor;
        btn.style.color = closeColor;
        btn.textContent = ".";
      }
      if (map[i][j].isOpen == "false" && map[i][j].isBlocked == "true") {
        btn.style.backgroundColor = closeColor;
        btn.style.color = "red";
        btn.textContent = "X";
      }
      if (
        map[i][j].isOpen == "true" &&
        map[i][j].isBlocked == "false" &&
        map[i][j].isClicked == "true"
      ) {
        btn.style.backgroundColor = "red";
        btn.style.color = "black";
        btn.textContent = "B";
        alert("koniec gry");
      }
    }
  }
  score.textContent = remainnigBombs;
  progressBar();
}

function clickField(id, e) {
  let j = Math.round(id / 100);
  let i = id % 100;
  if (e.button == 0) {
    if (map[i][j].isBlocked == "false") {
      if (map[i][j].isOpen == "true") {
        openNeighbours(i, j);
      } else {
        openField(i, j);
      }
    }
  }
  if (e.button == 2) {
    if (map[i][j].isOpen == "false") {
      if (map[i][j].isBlocked == "false") {
        remainnigBombs--;
        progress++;
        map[i][j].isBlocked = "true";
      } else {
        remainnigBombs++;
        progress--;
        map[i][j].isBlocked = "false";
      }
    }
  }

  if (remainnigBombs == 0 && remainingClose == 0) {
    win();
  }
  refresh();
}

function openField(i, j) {
  map[i][j].isOpen = "true";
  remainingClose--;
  progress++;
  if (map[i][j].n == 0) {
    openNeighbours(i, j);
  }
  if (map[i][j].n == 9) {
    map[i][j].isClicked = "true";
    gameOver(i, j);
  }
}

function openNeighbours(i, j) {
  zeroBorders(i + 1, j);
  zeroBorders(i - 1, j);
  zeroBorders(i, j + 1);
  zeroBorders(i, j - 1);
  zeroBorders(i + 1, j + 1);
  zeroBorders(i - 1, j + 1);
  zeroBorders(i - 1, j - 1);
  zeroBorders(i + 1, j - 1);
}

function zeroBorders(x, y) {
  if (x >= 0 && x < mapHeight && y >= 0 && y < mapWidth) {
    if (map[x][y].isBlocked == "true") return;
    if (map[x][y].isOpen == "false") {
      id = x + y * 100;
      openField(x, y);
    }
  }
}

function gameOver(i, j) {
  for (x = 0; x < mapHeight; x++) {
    for (y = 0; y < mapWidth; y++) {
      if (map[x][y].n == 9) {
        map[x][y].isOpen = "true";
      } else {
        openField(x, y);
      }
    }
  }
}

function win() {
  alert("you won");
}

function changeColor(btn) {
  switch (btn.textContent) {
    case "0":
      btn.style.color = openColor;
      break;
    case "1":
      btn.style.color = "blue";
      break;
    case "2":
      btn.style.color = "green";
      break;
    case "3":
      btn.style.color = "red";
      break;
    case "4":
      btn.style.color = "darkblue";
      break;
    case "5":
      btn.style.color = "brown";
      break;
    case "6":
      btn.style.color = "orange";
      break;
    case "7":
      btn.style.color = "yellow";
      break;
    case "8":
      btn.style.color = "black";
      break;
  }
}

function resetButton() {
  let reset = document.getElementById("reset");
  reset.addEventListener("mousedown", function (e) {
    newGame();
  });
}

function progressBar() {
  let bar = document.getElementById("progress");
  bar.style.width = progress/(mapWidth*mapHeight)*100 +"%";
}