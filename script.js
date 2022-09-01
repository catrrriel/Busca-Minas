const containerGame = document.querySelector(".container-game");
const game = document.querySelector(".game");
const result = document.querySelector(".result");
const flagCounter = document.getElementById("num-flags");
const remainingFlagCounter = document.getElementById("remaining-flags");
const btnGenerate = document.querySelector(".btn-generate");
const ocult = document.querySelector(".ocult");

btnGenerate.addEventListener("click", () => {
  createGame();
});

let width = 10;
let numBombs = 20;
let numFlags = 0;
let table = [];
let endGame = false;

const addNumbers = () => {
  for (let i = 0; i < width * width; i++) {
    let total = 0;
    const leftSide = i % width === 0;
    const rigthSide = i % width === width - 1;

    if (table[i].classList.contains("empty")) {
      console.log(table);
      //caja anterior
      if (i > 0 && !leftSide && table[i - 1].classList.contains("bomb"))
        total++;

      //caja siguiente
      if (
        i < width * width - 1 &&
        !rigthSide &&
        table[i + 1].classList.contains("bomb")
      )
        total++;

      //caja superior
      if (i > width && table[i - width].classList.contains("bomb")) total++;

      //caja siguiente de la fila anterior
      if (
        i > width - 1 &&
        !rigthSide &&
        table[i + 1 - width].classList.contains("bomb")
      )
        total++;

      //caja anterior de la fila anterior
      if (
        i > width &&
        !leftSide &&
        table[i - 1 - width].classList.contains("bomb")
      )
        total++;

      //caja inferior
      if (
        i < width * (width - 1) &&
        table[i + width].classList.contains("bomb")
      )
        total++;

      //caja siguiente de la fila siguiente
      if (
        i < width * (width - 1) &&
        !rigthSide &&
        table[i + 1 + width].classList.contains("bomb")
      )
        total++;

      //caja anterior de la fila siguiente
      if (
        i < width * (width - 1) &&
        !leftSide &&
        table[i - 1 + width].classList.contains("bomb")
      )
        total++;

      table[i].setAttribute("data", total);
    }
  }
};

const bomb = (boxClicked) => {
  endGame = true;

  table.forEach((box, index, array) => {
    if (box.classList.contains("bomb")) {
      box.innerHTML = "💣";
      box.classList.remove("bomb");
      box.classList.add("marked");
    }
  });

  result.textContent = "Perdiste fraca";
};

const addFlags = (box) => {
  if (endGame) return;

  if (!box.classList.contains("marked")) {
    if (!box.classList.contains("flag") && numFlags < numBombs) {
      box.classList.add("flag");
      box.innerHTML = "🚩";
      numFlags++;
      updateNumFlags();
      checkGame();
    } else if (box.classList.contains("flag")) {
      box.classList.remove("flag");
      box.innerHTML = "";
      numFlags--;
      updateNumFlags();
    }
  }
};

const updateNumFlags = () => {
  flagCounter.textContent = numFlags;
  remainingFlagCounter.textContent = numBombs - numFlags;
};

const checkGame = () => {
  let hits = 0;

  for (let i = 0; i < table.length; i++) {
    if (
      table[i].classList.contains("flag") &&
      table[i].classList.contains("bomb")
    )
      hits++;
  }

  if (hits === numBombs) {
    endGame = true;
    result.textContent = "Ganaste papa";
  }
};

const click = (box) => {
  console.log(box);
  if (
    !box &&
    (box.classList.contains("marked") ||
      box.classList.contains("flag") ||
      endGame)
  )
    return;

  if (box.classList.contains("bomb")) {
    bomb(box);
  } else {
    let total = box.getAttribute("data");

    if (total != 0) {
      box.classList.add("marked");
      box.innerHTML = total;
      return;
    } else {
      click(table[box.id - width - 1]); //arriba izq
      click(table[box.id - width]); //arriba
      click(table[box.id - width + 1]); // arriba der
      click(table[box.id + 1]); // derecha
      click(table[box.id + width + 1]); //abajo der
      click(table[box.id + width]); // abajo
      click(table[box.id + width - 1]); //abajo izq
      click(table[box.id - 1]); //izq
    }

    box.classList.add("marked");
  }
};

const createGame = () => {
  width = parseInt(document.getElementById("size").value);
  numBombs = parseInt(document.getElementById("num-bombs").value);
  ocult.classList.remove("ocult");

  if (containerGame.classList.contains("hidden")) {
    containerGame.classList.remove("hidden");
  } else {
    game.innerHTML = "";
    result.innerHTML = "";
    result.className = "result";
    table = [];
    endGame = false;
    numFlags = 0;
  }

  game.style.width = width * 50 + "px";

  const arrayBombs = Array(numBombs).fill("bomb");
  const arrayEmpty = Array(width * width - numBombs).fill("empty");
  const arrayFull = arrayEmpty.concat(arrayBombs);

  arrayFull.sort(() => Math.random() - 0.5);

  for (let i = 0; i < width * width; i++) {
    const box = document.createElement("div");
    box.setAttribute("id", i);
    box.classList.add(arrayFull[i]);
    game.appendChild(box);
    table.push(box);

    box.addEventListener("click", () => {
      click(event.target);
    });

    box.oncontextmenu = function (event) {
      event.preventDefault();
      addFlags(box);
    };
  }

  updateNumFlags();
  addNumbers();
};
