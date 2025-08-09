let juegosDisponibles = [];
let juegosSeleccionados = [];
let progreso = 0;
const TOTAL_PISOS = 100;

// Elementos
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const giveUpBtn = document.getElementById('giveup-btn');
const restartBtns = document.querySelectorAll('#restart-btn, #restart-btn-finish');

const intro = document.getElementById('intro');
const gameSection = document.getElementById('game-section');
const giveupSection = document.getElementById('giveup-section');
const finishedSection = document.getElementById('finished-section');

const gameTitle = document.getElementById('game-title');
const gameImage = document.getElementById('game-image');
const gameDifficulty = document.getElementById('game-difficulty');
const gameFloor = document.getElementById('game-floor');
const gameDownload = document.getElementById('game-download');
const gameDesc = document.getElementById('game-desc');
const remainingGamesList = document.getElementById('remaining-games');

window.onload = () => {
  const saved = JSON.parse(localStorage.getItem('reto-xfloor'));
  if (saved && saved.juegos && saved.progreso < TOTAL_PISOS) {
    juegosSeleccionados = saved.juegos;
    progreso = saved.progreso;
    showGame();
  }
};

startBtn.addEventListener('click', async () => {
    juegosDisponibles = JUEGOS_DATA;
    juegosSeleccionados = [];
    let juegosUsados = new Set();

    for (let piso = 1; piso <= TOTAL_PISOS; piso++) {
        const posibles = juegosDisponibles.filter(j => 
            j.pisos >= piso && !juegosUsados.has(j.nombre)
        );

        if (posibles.length === 0) {
            alert(`No hay suficientes juegos únicos con al menos ${piso} pisos.`);
            return;
        }

        const elegido = posibles[Math.floor(Math.random() * posibles.length)];
        if (validateGame(elegido.nombre, piso)) {
            juegosUsados.add(elegido.nombre);
            juegosSeleccionados.push({ ...elegido, piso });
        }
    }

    progreso = 0;
    guardarProgreso();
    showGame();
});


nextBtn.addEventListener('click', () => {
  progreso++;
  if (progreso >= TOTAL_PISOS) {
    localStorage.removeItem('reto-xfloor');
    showFinished();
  } else {
    guardarProgreso();
    showGame();
  }
});

giveUpBtn.addEventListener('click', () => {
  showGiveUp();
});

restartBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    localStorage.removeItem('reto-xfloor');
    location.reload();
  });
});

function showGame() {
  intro.classList.add('hidden');
  gameSection.classList.remove('hidden');
  giveupSection.classList.add('hidden');
  finishedSection.classList.add('hidden');

  const actual = juegosSeleccionados[progreso];
  gameTitle.textContent = actual.nombre;
  gameImage.src = `imagenes/${actual.imagen}`;
  gameDifficulty.textContent = actual.dificultad.toFixed(1);
  gameFloor.textContent = actual.piso;
  gameDownload.href = actual.descarga;

  if (actual.descripcion && actual.descripcion.trim() !== "") {
    gameDesc.textContent = actual.descripcion;
    gameDesc.style.display = 'block';
  } else {
    gameDesc.textContent = "";
    gameDesc.style.display = 'none';
  }

  showPassedGames();
}

function showGiveUp() {
    gameSection.classList.add('hidden');
    giveupSection.classList.remove('hidden');

    const restantes = juegosSeleccionados.slice(progreso);
    
    remainingGamesList.innerHTML = '';
    restantes.forEach(j => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="game-entry failed">
                <img src="imagenes/${j.imagen}" alt="${j.nombre}" />
                <div class="game-info">
                    <h3>${j.nombre}</h3>
                    <p><strong>Dificultad:</strong> ${j.dificultad.toFixed(1)}</p>
                    <p><strong>Piso:</strong> ${j.piso}</p>
                </div>
            </div>
        `;
        remainingGamesList.appendChild(li);
    });

    localStorage.removeItem('reto-xfloor');
}

function showFinished() {
  gameSection.classList.add('hidden');
  finishedSection.classList.remove('hidden');
}

function guardarProgreso() {
  localStorage.setItem('reto-xfloor', JSON.stringify({
    juegos: juegosSeleccionados,
    progreso: progreso
  }));
}

function showPassedGames() {
  const passedList = document.getElementById('juegos-pasados');
  passedList.innerHTML = '';

  for (let i = 0; i < progreso; i++) {
    const juego = juegosSeleccionados[i];
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="game-entry passed">
        <img src="imagenes/${juego.imagen}" alt="${juego.nombre}" />
        <div class="game-info">
          <h3>${juego.nombre}</h3>
          <p><strong>Dificultad:</strong> ${juego.dificultad.toFixed(1)}</p>
          <p><strong>Piso:</strong> ${juego.piso}</p>
        </div>
      </div>
    `;
    passedList.appendChild(li);
  }
}

function validateGame(game, floor) {
    switch(game){
        case "Crimson Needle 3":
            return !(floor > 31 && floor < 70);
        case "I wanna find a Needle in a Haystack 2":
            return (floor >= 25 && floor <= 51);
        default:
            return true;
    }
}