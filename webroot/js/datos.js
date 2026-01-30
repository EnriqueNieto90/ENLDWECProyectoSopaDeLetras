export async function obtenerPalabras() {
    // Valor por defecto por si falla la API
    let palabrasAPI = ["TELEFONO", "ORDENADOR"]; 

    try {
        const respuesta = await fetch('https://random-word-api.herokuapp.com/word?number=5');
        const datos = await respuesta.json();
        
        palabrasAPI = datos.map(palabra => palabra.toUpperCase());

    } catch (error) {
        console.error('Error al conectar con la API, usando palabras por defecto:', error);
    } 
    
    return palabrasAPI;
}

export var aDirecciones = [
    [1, 1, 0, -1, -1, -1, 0, 1], // Incremento Fila
    [0, 1, 1, 1, 0, -1, -1, -1]  // Incremento Columna
];

export const VOCALES = "AEIOU";
export const CONSONANTES = "BCDFGHJKLMNPQRSTVWXYZ";