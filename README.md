
# X_Floor Roulette

Una versión adaptada del concepto **Extreme Demon Roulette** de Geometry Dash, pero para los fangames de **I Wanna Be The Guy** con el tag `x_floor` (juegos de x pisos).  
El reto consiste en superar **100 juegos**, avanzando piso por piso en orden creciente.

---

## 🎯 Cómo funciona
1. Presiona **"Iniciar reto"** para comenzar.
2. El sistema genera una lista aleatoria de juegos desde la base de datos (sin repeticiones).
3. En cada juego se te asignará un **piso objetivo** que debes alcanzar y superar.
4. Al completar un piso, avanza al siguiente juego con el botón **"Siguiente"**.
5. Si decides rendirte, puedes ver:
   - Los juegos que ya completaste (marcados en verde).
   - Los juegos que quedaban por jugar (marcados en rojo).
6. El reto termina al superar el piso 100 o al rendirte.

---

## 📂 Datos de los juegos
Cada juego incluye:
- **Nombre**
- **Dificultad** (0–100, con decimales)
- **Número total de pisos**
- **Imagen** (pantalla de título)
- **Link de descarga**
- *(Opcional)* Descripción o consejos específicos para el juego

Algunos juegos tienen reglas especiales para los pisos válidos, por ejemplo:
- **Crimson Needle 3**: No se juegan pisos entre 32 y 69.
- **I Wanna find a Needle in a Haystack 2**: Solo incluye pisos entre 25 y 51.

---

## 💾 Guardado de progreso
- El progreso se guarda automáticamente en el navegador usando **localStorage**.
- Si recargas la página, podrás continuar desde donde estabas.
- El botón **"Reiniciar reto"** permite comenzar desde cero.

---

## 🛠️ Tecnologías usadas
- **HTML5** para la estructura.
- **CSS3** para el diseño minimalista.
- **JavaScript** para la lógica del reto y manejo de datos.
- **localStorage** para persistencia local.