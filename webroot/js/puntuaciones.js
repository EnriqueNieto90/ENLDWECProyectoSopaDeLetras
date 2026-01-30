const CLAVE_STORAGE = 'sopaLetras_puntuaciones_v2';

// Inicializa los datos si no existen
export function inicializarPuntuaciones() {
    if (localStorage.getItem(CLAVE_STORAGE) === null) {
        const puntuacionesIniciales = [
            // Nivel 0 (Por defecto)
            [
                { "nombre": "---", "puntuacion": 0 },
                { "nombre": "---", "puntuacion": 0 },
                { "nombre": "---", "puntuacion": 0 }
            ],
            // Nivel 1
            [
                { "nombre": "---", "puntuacion": 999 },
                { "nombre": "---", "puntuacion": 999 },
                { "nombre": "---", "puntuacion": 999 }
            ]
        ];
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(puntuacionesIniciales));
    }
}

// Devuelve el array de puntuaciones para un nivel concreto
export function obtenerPuntuaciones(nivel = 0) {
    inicializarPuntuaciones();
    const todos = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
    return todos[nivel];
}

// Guarda, ordena y corta el array para mantener solo el TOP 3
export function guardarPuntuacion(nombre, tiempoSegundos, nivel = 0) {
    const todos = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
    
    // 1. Añadimos la nueva puntuación
    todos[nivel].push({ 
        "nombre": nombre, 
        "puntuacion": tiempoSegundos 
    });

    // 2. Ordenamos de menor a mayor (el tiempo más bajo gana)
    todos[nivel].sort((a, b) => a.puntuacion - b.puntuacion);

    // 3. Nos quedamos solo con los 3 mejores
    todos[nivel] = todos[nivel].slice(0, 3);

    // 4. Guardamos en LocalStorage
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(todos));
    
    // Devolvemos la lista actualizada del nivel
    return todos[nivel];
}

// Calcula si el tiempo conseguido entra en el podio (1, 2 o 3)
export function calcularPosicionRecord(tiempoSegundos, nivel = 0) {
    const records = obtenerPuntuaciones(nivel);
    
    // Si hay huecos libres (menos de 3 records), entra seguro
    if (records.length < 3) {
        // Miramos en qué posición encaja
        for (let i = 0; i < records.length; i++) {
            if (tiempoSegundos < records[i].puntuacion) return i + 1;
        }
        return records.length + 1;
    }

    // Si la tabla está llena, miramos si supera a alguno
    for (let i = 0; i < 3; i++) {
        // Si el tiempo nuevo es MENOR que el registrado, es un récord
        if (tiempoSegundos < records[i].puntuacion) {
            return i + 1;
        }
    }
    
    return 0; // No es récord
}