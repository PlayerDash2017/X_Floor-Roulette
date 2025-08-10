let gamesAvailable = [];
let gameSelect = [];
let progress = 0;
let skips = 3;
const TOTAL_PISOS = 100;
 
//#region Elementos

//Botones
const btnStart = document.getElementById('btn_start');
const btnIntruct = document.getElementById('btn_intruct');
const btnConfig = document.getElementById('btn_config');

const btnNext = document.getElementById('btn_next');
const btnSkip = document.getElementById('btn_skip');
const btnGiveUp = document.getElementById('btn_giveup');
const btnRestart = document.querySelectorAll('#btn_restart, #btn_finish');

//Section del challenge
const introduction = document.getElementById('Presentation');
const chalStart = document.getElementById('Section_Challenge');
const instructMenu = document.getElementById('Section_Instruction')
const configMenu = document.getElementById('Section_Config');

const chalPassed = document.getElementById('Challenge_Passed');
const chalCurrent = document.getElementById('Challenge_Current');
const chalFailed = document.getElementById('Challenge_Failed');
const chalFinish = document.getElementById('Challenge_Finish');

//Informacion del juego
const gameInfo = document.getElementById('Game_Info');
const gameTitle = document.getElementById('Game_Title');
const gameImage = document.getElementById('Game_Image');
const gameDiff = document.getElementById('Game_Diff');
const gameFloor = document.getElementById('Game_Floor');
const gameDesc = document.getElementById('Game_Desc');
const gameDownload = document.getElementById('Game_Download');
const gameButtons = document.getElementById('Game_Buttons');

const listPassed = document.getElementById('List_Passed');
const listFailed = document.getElementById('List_Failed');

//#endregion

//#region Sistema aparte

//carga el progreso
window.onload = () => {
    const saved = JSON.parse(localStorage.getItem('reto-xfloor'));
    if (saved && saved.juegos && saved.progreso < TOTAL_PISOS) {
        gameSelect = saved.juegos;
        progress = saved.progreso;
        skips = saved.skips;
        btnSkip.textContent = `Cambiar juego (${skips})`;
        showGame();
    }
};

//En caso de que una imagen no se haya cargado
document.addEventListener('error', function (e) {
    if (e.target.tagName.toLowerCase() === 'img') {
      e.target.src = 'img/NoFound.png';
    }
}, true);

//#endregion

//#region Botones

//Leer instrucciones
btnIntruct.addEventListener('click', async () => {
    instructMenu.classList.remove('hidden');
    configMenu.classList.add('hidden');
});

//Configurar el reto
btnConfig.addEventListener('click', async () => {
    configMenu.classList.remove('hidden');
    instructMenu.classList.add('hidden');
});

//Empezar reto
btnStart.addEventListener('click', async () => {
    gamesAvailable = GAME_DATA;
    gameSelect = [];
    let gameUsed = new Set();

    for (let piso = 1; piso <= TOTAL_PISOS; piso++) {
        const posibles = gamesAvailable.filter(j => 
            j.pisos >= piso && !gameUsed.has(j.nombre) && validateGame(j.nombre, piso)
        );

        if (posibles.length === 0) {
            alert(`No hay suficientes juegos únicos con al menos ${piso} pisos.`);
            return;
        }

        const elegido = posibles[Math.floor(Math.random() * posibles.length)];
        gameUsed.add(elegido.nombre);
        gameSelect.push({ ...elegido, piso });

        print(posibles.length);
    }

    btnSkip.textContent = "Cambiar juego (3)";
    skips = 3;
    progress = 0;
    saveProgress();
    showGame();
});

//Siguiente juego
btnNext.addEventListener('click', () => {
    progress++;

    if (progress >= TOTAL_PISOS) {
        localStorage.removeItem('reto-xfloor');
        showPassedGames();
        showFinished();
    } else {
        saveProgress();
        showGame();
    }

     window.scrollTo(0, document.body.scrollHeight);
});

//Cambiar de juego
btnSkip.addEventListener('click', () => {
    if (skips <= 0){
        alert("Ya no puedes volver a cambiar de juego.")
        return;
    }

    skips --;

    const pisoActual = gameSelect[progress].piso;
    const gameUsed = new Set(gameSelect.map(j => j.nombre)); 
    gameUsed.delete(gameSelect[progress].nombre); // Permitimos quitar el actual para cambiarlo

    const posibles = gamesAvailable.filter(j => 
        j.pisos >= pisoActual &&
        !gameUsed.has(j.nombre) &&
        validateGame(j.nombre, pisoActual)
    );

    if (posibles.length === 0) {
        alert("No hay juegos disponibles para reemplazar este piso.");
        return;
    }

    const _confirm = confirm("¿Seguro que quieres cambiar de juego?.");
    if (!_confirm) return;

    const elegido = posibles[Math.floor(Math.random() * posibles.length)];
    gameSelect[progress] = { ...elegido, piso: pisoActual };
    btnSkip.textContent = `Cambiar juego (${skips})`;
    saveProgress();
    showGame();
});

//Rendir
btnGiveUp.addEventListener('click', () => {
    showGiveUp();
});

//Reintentar el reto
btnRestart.forEach(btn => {
  btn.addEventListener('click', () => {
    localStorage.removeItem('reto-xfloor');
    location.reload();
  });
});

//#endregion

//#region Functions

function print(text){
    console.log(text);
}

function showGame() {//mostrar juego
    introduction.classList.add('hidden');
    configMenu.classList.add('hidden');
    instructMenu.classList.add('hidden');

    chalStart.classList.remove('hidden');
    chalFailed.classList.add('hidden');
    chalFinish.classList.add('hidden');

    const current = gameSelect[progress];
    gameTitle.textContent = current.nombre;
    gameImage.src = `img/${current.imagen}`;
    gameDiff.textContent = current.dificultad.toFixed(1);
    gameFloor.textContent = current.piso;
    gameDownload.href = current.descarga;

    if (current.descripcion && current.descripcion.trim() !== "") {
        gameDesc.textContent = current.descripcion;
        gameDesc.style.display = 'block';
    } else {
        gameDesc.textContent = "";
        gameDesc.style.display = 'none';
    }

    showPassedGames();
}

function showGiveUp() {//rendirte
    const _confirm = confirm("¿Seguro que quieres rendirte?.");
    if (!_confirm) return;

    chalCurrent.classList.add('hidden');
    chalFailed.classList.remove('hidden');

    const restantes = gameSelect.slice(progress);
    
    listFailed.innerHTML = '';
    restantes.forEach(j => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="Game_Entry Failed">
                <img src="img/${j.imagen}" alt="${j.imagen}" />
                <div class="Game_Info">
                    <h3>${j.nombre}</h3>
                    <p><strong>Dificultad:</strong> ${j.dificultad.toFixed(1)}</p>
                    <p><strong>Piso:</strong> ${j.piso}</p>
                </div>
            </div>
        `;
        listFailed.appendChild(li);
    });

    localStorage.removeItem('reto-xfloor');
}

function showFinished() {//terminar
    chalCurrent.classList.add('hidden');
    chalFinish.classList.remove('hidden');
}

function saveProgress() {//guardar progreso
    localStorage.setItem('reto-xfloor', JSON.stringify({
        juegos: gameSelect,
        progreso: progress,
        skips: skips
    }));
}

function showPassedGames() {//mostrar juegos pasados
    const passedList = document.getElementById('List_Passed');
    passedList.innerHTML = '';

    for (let i = 0; i < progress; i++) {
        const juego = gameSelect[i];
        const li = document.createElement('li');

        li.innerHTML = `
            <div class="Game_Entry Passed">
                <img src="img/${juego.imagen}" alt="${juego.imagen}" />
                <div class="Game_Info">
                    <h3>${juego.nombre}</h3>
                    <p><strong>Dificultad:</strong> ${juego.dificultad.toFixed(1)}</p>
                    <p><strong>Piso:</strong> ${juego.piso}</p>
                </div>
            </div>
        `;
        passedList.appendChild(li);
    }
}

function validateGame(game, floor) {//Validacion del juego
    switch(game){
        case "Crimson Needle 3":
            return !(floor > 31 && floor < 70);
        case "I wanna find a Needle in a Haystack 2":
            return (floor >= 25 && floor <= 51);
        default:
            return true;
    }
}

//#endregion