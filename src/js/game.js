import {
  createTree,
  createBranch,
  createRope,
  createHead,
  createBody,
  createFirtsArm,
  createSecondArm,
  createFirstFoot,
  createSecondFoot,
  restartGame,
  radio,
  switchColorCanvas,
  canvasDrew,
} from "./canvas-horca.js";

import { getWordSecret } from "./palabra-secreta.js";
import { createFieldLetter, createFieldLetterWrong } from "./horca-letra.js";
import { validaModeStorage, getModeStorage, addModeStorage } from "./modes.js";
import { normalAlert, normalAlertIcon } from "./alerts.js";

const newGame = document.getElementById("new-game");
const life = document.getElementById("life");
const circleSwitch = document.getElementById("circle-switch");
const keyboardMobile = document.getElementById("keyboard-mobile");
const pressMe = document.querySelector(".press-me-keyboard");

// obteniendo datos de local Storage
const wordsStorage = JSON.parse(localStorage.getItem("words"));

let wordSecret;
let contadorHorca = 1;
let letterNotValid = true;
let countLife = 9;
let localStorageMode;
let lettersWrong = [];

// horca letra
getWordSecret(wordsStorage, (word) => {
  let lengthWord = word.length;
  wordSecret = word;
  createFieldLetter(lengthWord);
});
life.textContent = "";
life.textContent = countLife;

createFieldLetterWrong();

let arrayWordSecret = [...wordSecret];

// restar intentos(vidas)
const subtractLifeGame = () => {
  if (countLife > 0) {
    countLife--;
  }

  life.textContent = "";
  life.textContent = countLife;
};

// restaurar vida
const restartlifeGame = () => {
  countLife = 9;
  life.textContent = "";
  life.textContent = countLife;
};

const restartGameLossWin = () => {
  setTimeout(() => {
    // restaurar juego
    restartGame();
    restartlifeGame();
    contadorHorca = 1;
    lettersWrong = [];

    // generar nueva palabra
    getWordSecret(wordsStorage, (word) => {
      let lengthWord = word.length;
      wordSecret = word;
      createFieldLetter(lengthWord);
      arrayWordSecret = [...wordSecret];
    });
    createFieldLetterWrong();
  }, 800);
};

// validar juego perdido
const validateLoss = (life) => {
  if (life === 9) {
    keyboardMobile.blur();

    const modeStorage = JSON.parse(localStorage.getItem("mode"));

    const modeolor = modeStorage.mode === "dark" ? "#393d3fff" : "#c6c5b9ff";

    // alert
    normalAlertIcon(
      `Que mal, Casi lo logras.
       La palabra era: <span style="color:${modeolor};">${wordSecret}<span>`,
      "warning",
      "😪",
      1800
    );

    restartGameLossWin();
  }
};

//  validar ganador
const validateWinner = (arrayWordSecret) => {
  let lengthWord = arrayWordSecret.length;
  let ZeroOnArray = arrayWordSecret.filter((x) => x == "0").length;
  if (ZeroOnArray === lengthWord) {
    keyboardMobile.blur();

    // alerta
    normalAlertIcon("Felicidades, Ganaste", "success", "🏆", 1800);

    restartGameLossWin();
  }
};

// restaurar juego
newGame.addEventListener("click", () => {
  restartGame();
  restartlifeGame();
  contadorHorca = 1;
  lettersWrong = [];

  //   alert;
  normalAlert("Juego Restaurado", "success", 1500);

  getWordSecret(wordsStorage, (word) => {
    let lengthWord = word.length;
    wordSecret = word;
    createFieldLetter(lengthWord);
    arrayWordSecret = [...wordSecret];
  });

  createFieldLetterWrong();
});

// agregar letra
const addLetter = (letter, i) => {
  const lettersWord = document.querySelectorAll(".letter-container .lineSpan");
  lettersWord[i].textContent = letter;
};

// dibujar partes de la horca
const drawParts = (keyPress) => {
  // descontar vidas
  subtractLifeGame();

  if (contadorHorca === 1) {
    createTree();
  }
  if (contadorHorca === 2) {
    createBranch();
  }
  if (contadorHorca === 3) {
    createRope();
  }
  if (contadorHorca === 4) {
    createHead("face1", radio);
  }
  if (contadorHorca === 5) {
    createBody();
    createHead("face2", radio);
  }
  if (contadorHorca === 6) {
    createFirtsArm();
    createHead("face3", radio);
  }
  if (contadorHorca === 7) {
    createSecondArm();
    createHead("face4", radio);
  }
  if (contadorHorca === 8) {
    createFirstFoot();
    createHead("face5", radio);
  }
  if (contadorHorca === 9) {
    createSecondFoot();
    createHead("face6", radio);
  }

  // pintar letras erroneas
  if (contadorHorca <= 9) {
    const wrongLineSpan = document.querySelectorAll(".letter-wrong .lineSpan");
    wrongLineSpan[contadorHorca - 1].textContent = keyPress;
  }

  // validar ganador
  validateLoss(contadorHorca);

  contadorHorca++;
};

const keyboardValidate = (e) => {
  const reg = RegExp("[a-z]", "i");
  let keyPress;

  if (typeof e !== "string") {
    keyPress = e.key.toUpperCase();
  } else {
    keyPress = e.toUpperCase();
  }

  //* validar si la tecla presionada es una letra
  if (reg.test(keyPress) && keyPress.length === 1) {
    // validar letra
    for (let i = 0; i < arrayWordSecret.length; i++) {
      let letter = arrayWordSecret[i];

      if (letter === keyPress) {
        arrayWordSecret.splice(i, 1, "0");
        addLetter(letter, i);
        validateWinner(arrayWordSecret);

        return;
      }
    }

    if (letterNotValid && !lettersWrong.includes(keyPress)) {
      drawParts(keyPress);
      letterNotValid = true;
      lettersWrong.push(keyPress);
    }
  }
};

if (
  !(
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  )
) {
  pressMe.classList.remove("mobile");
  // start
  document.addEventListener("keyup", (e) => {
    keyboardValidate(e);
  });
} else {
  pressMe.classList.add("mobile");
  // keyboardmobile
  keyboardMobile.addEventListener("input", (e) => {
    keyboardValidate(e.data);
    keyboardMobile.value = "";
  });
}

circleSwitch.addEventListener("click", () => {
  localStorageMode = getModeStorage();
  if (localStorageMode.mode !== "dark") {
    document.body.classList.remove("light");
    addModeStorage("dark");
  } else {
    document.body.classList.add("light");
    addModeStorage("light");
  }

  switchColorCanvas();
});

validaModeStorage(localStorageMode);
