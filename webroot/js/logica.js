import { aDirecciones, VOCALES, CONSONANTES } from './datos.js';

export function palabramasLarga(aPalabras) {
    let palabraLarga = 0;
    for (const palabra of aPalabras) {
        if (palabra.length > palabraLarga) {
            palabraLarga = palabra.length;
        }
    }
    return palabraLarga;
}

export function cantidadLetras(aPalabras) {
    let contarLetras = 0;
    for (const palabra of aPalabras) {
        contarLetras += palabra.length;
    }
    return contarLetras;
}

export function calcTamTablero(palabraLarga, totalLetras) {
    let anchoTablero = parseInt(Math.sqrt(totalLetras * 2)) + 1;
    if (palabraLarga > anchoTablero) {
        anchoTablero = palabraLarga;
    }
    return anchoTablero;
}

export function crearTablero(tamTablero) {
    let celdas = [];
    for (let i = 0; i < tamTablero; i++) {
        celdas[i] = [];
        for (let j = 0; j < tamTablero; j++) {
            celdas[i][j] = 0;
        }
    }
    return celdas;
}

export function posicionAleatoria(max) {
    return Math.floor(Math.random() * max);
}

export function recorrerPalabras(palabras, tablero, tamTab) {
    const palabrasOrdenadas = [...palabras].sort((a, b) => b.length - a.length);
    
    for (const p of palabrasOrdenadas) {
        let colocada = false;
        let intentos = 0;
        const MAX_INTENTOS = 150;

        while (!colocada && intentos < MAX_INTENTOS) {
            let fila = posicionAleatoria(tamTab);
            let col = posicionAleatoria(tamTab);
            let dirIndex = posicionAleatoria(8);
            
            colocada = intentarColocar(p, fila, col, dirIndex, tablero, tamTab);
            intentos++;
        }

        if (!colocada) {
            console.warn("No se pudo colocar la palabra: " + p);
        }
    }
}

export function intentarColocar(palabra, fila, col, dirIndex, tablero, tamTab) {
    const letras = palabra.toUpperCase().split('');
    const incFila = aDirecciones[0][dirIndex];
    const incCol = aDirecciones[1][dirIndex];

    for (let i = 0; i < letras.length; i++) {
        const f = fila + (i * incFila);
        const c = col + (i * incCol);

        if (f < 0 || f >= tamTab || c < 0 || c >= tamTab) return false;

        const celda = tablero[f][c];
        if (celda !== 0 && celda !== letras[i]) return false;
    }

    for (let i = 0; i < letras.length; i++) {
        const f = fila + (i * incFila);
        const c = col + (i * incCol);
        tablero[f][c] = letras[i];
    }
    return true;
}

export function rellenarTablero(tablero, tamTab) {
    for (let i = 0; i < tamTab; i++) {
        for (let j = 0; j < tamTab; j++) {
            if (tablero[i][j] === 0) {
                let letraAleatoria = (Math.random() < 0.7) 
                    ? CONSONANTES[posicionAleatoria(CONSONANTES.length)]
                    : VOCALES[posicionAleatoria(VOCALES.length)];
                tablero[i][j] = letraAleatoria;
            }
        }
    }
}