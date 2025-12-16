import { palabras } from './datos.js';
import * as Logica from './logica.js';
import * as Interfaz from './interfaz.js';
import * as Puntuaciones from './puntuaciones.js';

// Variables globales del juego
let celdaInicio = null;
let aciertos = 0;
let tamTab = 0;
let tiempoInicio = null;
let intervaloReloj = null;
let juegoIniciado = false;

// Calcular tamaño del tablero
const TAM_PALABRA_MAYOR = Logica.palabramasLarga(palabras);
const TOTAL_LETRAS_PALABARAS = Logica.cantidadLetras(palabras);
tamTab = Logica.calcTamTablero(TAM_PALABRA_MAYOR, TOTAL_LETRAS_PALABARAS);
var tablero = Logica.crearTablero(tamTab);

// Generar sopa de letras
Logica.recorrerPalabras(palabras, tablero, tamTab);
Logica.rellenarTablero(tablero, tamTab);

// Crear interfaz inicial
Interfaz.crearBotonComenzar();
Interfaz.dibujarTablero(tablero, manejarClickJuego);
Interfaz.crearPanelInfo(tamTab, palabras);
Interfaz.crearTablaPuntuaciones();
Interfaz.actualizarTablaPuntuaciones(Puntuaciones.obtenerPuntuaciones());
Interfaz.crearReloj();

// Ocultar tablero hasta que se pulse comenzar
Interfaz.ocultarTablero();

// Listener del botón comenzar
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-comenzar') {
        comenzarJuego();
    }
});

function comenzarJuego() {
    juegoIniciado = true;
    Interfaz.ocultarBotonComenzar();
    Interfaz.mostrarTablero();
    Interfaz.crearRelojJuego();
    
    // Iniciar cronómetro
    tiempoInicio = Date.now();
    let segundosTranscurridos = 0;
    
    intervaloReloj = setInterval(function() {
        segundosTranscurridos = Math.floor((Date.now() - tiempoInicio) / 1000);
        Interfaz.actualizarRelojJuego(segundosTranscurridos);
    }, 1000);
}

function manejarClickJuego(e) {
    if (!juegoIniciado) return;
    
    const celdaClicada = e.target; 

    if (celdaClicada.classList.contains('encontrada')) return;

    // Primer click: seleccionar celda inicial
    if (celdaInicio === null) {
        celdaInicio = celdaClicada;
        celdaInicio.classList.add('seleccionada');
        return;
    }

    // Segundo click en la misma celda: deseleccionar
    if (celdaClicada === celdaInicio) {
        celdaInicio.classList.remove('seleccionada');
        celdaInicio = null;
        return;
    }

    // Segundo click en celda diferente: validar selección
    const f1 = parseInt(celdaInicio.dataset.fila);
    const c1 = parseInt(celdaInicio.dataset.col);
    const f2 = parseInt(celdaClicada.dataset.fila);
    const c2 = parseInt(celdaClicada.dataset.col);

    const caminoCeldas = obtenerCamino(f1, c1, f2, c2);

    if (caminoCeldas) {
        validarPalabra(caminoCeldas);
    } else {
        celdaInicio.classList.remove('seleccionada');
    }

    celdaInicio = null;
}

function obtenerCamino(f1, c1, f2, c2) {
    const diffFila = f2 - f1;
    const diffCol = c2 - c1;
    const pasoFila = Math.sign(diffFila); 
    const pasoCol = Math.sign(diffCol);

    // Validar que sea línea recta (horizontal, vertical o diagonal)
    if (diffFila !== 0 && diffCol !== 0 && Math.abs(diffFila) !== Math.abs(diffCol)) {
        return null; 
    }

    let celdasCamino = [];
    let fActual = f1;
    let cActual = c1;
    const pasosTotales = Math.max(Math.abs(diffFila), Math.abs(diffCol));

    for (let i = 0; i <= pasosTotales; i++) {
        const selector = `td[data-fila="${fActual}"][data-col="${cActual}"]`;
        const celda = document.querySelector(selector);
        celdasCamino.push(celda);

        fActual += pasoFila;
        cActual += pasoCol;
    }

    return celdasCamino;
}

function validarPalabra(celdas) {
    let palabraFormada = "";
    
    for (let i = 0; i < celdas.length; i++) {
        palabraFormada += celdas[i].textContent;
    }

    const palabraInvertida = palabraFormada.split('').reverse().join('');
    
    const encontradaOriginal = palabras.includes(palabraFormada);
    const encontradaInversa = palabras.includes(palabraInvertida);

    if (encontradaOriginal || encontradaInversa) {
        const palabraCorrecta = encontradaOriginal ? palabraFormada : palabraInvertida;
        
        // Marcar celdas como encontradas
        for (let i = 0; i < celdas.length; i++) {
            celdas[i].classList.remove('seleccionada');
            celdas[i].classList.add('encontrada');
        }

        Interfaz.tacharDeLista(palabraCorrecta);

        aciertos++;
        
        if (aciertos === palabras.length) {
            finalizarJuego();
        }

    } else {
        celdaInicio.classList.remove('seleccionada');
    }
}

function finalizarJuego() {
    // Detener cronómetro
    clearInterval(intervaloReloj);
    
    const tiempoFinalSegundos = Math.floor((Date.now() - tiempoInicio) / 1000);
    const minutos = Math.floor(tiempoFinalSegundos / 60);
    const segundos = tiempoFinalSegundos % 60;
    const tiempoTexto = minutos + ' minutos y ' + segundos + ' segundos';
    
    setTimeout(function() {
        alert('¡JUEGO TERMINADO!\n\nTu tiempo: ' + tiempoTexto);
        
        // Comprobar si es tiempo récord
        const posicionRecord = Puntuaciones.esTiempoRecord(tiempoFinalSegundos);
        
        if (posicionRecord > 0) {
            alert('¡FELICIDADES! Has conseguido un récord en la posición ' + posicionRecord);
            
            Interfaz.habilitarInputNombre(posicionRecord);
            
            const inputNombre = document.querySelector('.input-nombre[data-posicion="' + posicionRecord + '"]');
            
            // Guardar puntuación cuando el usuario presione Enter
            inputNombre.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const nombre = Interfaz.obtenerNombreInput(posicionRecord);
                    
                    // Reorganizar puntuaciones si hace falta
                    const puntuacionesActuales = Puntuaciones.obtenerPuntuaciones();
                    const nuevasPuntuaciones = [];
                    
                    let insertado = false;
                    for (let i = 0; i < 3; i++) {
                        if (i + 1 === posicionRecord && !insertado) {
                            nuevasPuntuaciones.push({
                                nombre: nombre,
                                tiempo: formatearTiempo(tiempoFinalSegundos),
                                segundos: tiempoFinalSegundos
                            });
                            insertado = true;
                        }
                        
                        if (puntuacionesActuales[i] && nuevasPuntuaciones.length < 3) {
                            if (i + 1 !== posicionRecord) {
                                nuevasPuntuaciones.push(puntuacionesActuales[i]);
                            }
                        }
                    }
                    
                    Puntuaciones.guardarPuntuacion(nombre, tiempoFinalSegundos, posicionRecord);
                    Interfaz.actualizarTablaPuntuaciones(nuevasPuntuaciones);
                    
                    inputNombre.disabled = true;
                }
            });
        }
    }, 300);
}

function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return minutos.toString().padStart(2, '0') + ':' + segs.toString().padStart(2, '0');
}