const CLAVE_STORAGE = 'sopaLetras_mejoresPuntuaciones';
const MAX_PUNTUACIONES = 3;

export function guardarPuntuacion(nombre, tiempoSegundos, posicion) {
    const puntuaciones = obtenerPuntuaciones();
    
    const tiempoFormateado = formatearTiempo(tiempoSegundos);
    
    const nuevaPuntuacion = {
        nombre: nombre,
        tiempo: tiempoFormateado,
        segundos: tiempoSegundos
    };
    
    puntuaciones[posicion - 1] = nuevaPuntuacion;
    
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(puntuaciones));
    
    return puntuaciones;
}

export function obtenerPuntuaciones() {
    const datos = localStorage.getItem(CLAVE_STORAGE);
    
    if (datos === null) {
        return [];
    }
    
    return JSON.parse(datos);
}

// Devuelve la posición (1, 2 o 3) si es récord, o 0 si no lo es
export function esTiempoRecord(tiempoSegundos) {
    const puntuaciones = obtenerPuntuaciones();
    
    for (let i = 0; i < MAX_PUNTUACIONES; i++) {
        if (!puntuaciones[i]) {
            return i + 1;
        }
        if (tiempoSegundos < puntuaciones[i].segundos) {
            return i + 1;
        }
    }
    
    return 0;
}

function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return minutos.toString().padStart(2, '0') + ':' + segs.toString().padStart(2, '0');
}