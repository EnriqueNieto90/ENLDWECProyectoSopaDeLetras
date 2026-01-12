const main = document.querySelector("main");
const pie = document.querySelector("footer");

// Crear contenedor para el juego (tablero + info)
const contenedorJuego = document.createElement('div');
contenedorJuego.id = 'contenedor-juego';

const tableroContainer = document.createElement('div');
tableroContainer.id = 'tablero-container';

const infoContainer = document.createElement('div');
infoContainer.id = 'info';

contenedorJuego.append(tableroContainer, infoContainer);
main.appendChild(contenedorJuego);

export function crearBotonComenzar() {
    const contenedorBoton = document.createElement('div');
    contenedorBoton.id = 'contenedor-boton-inicio';
    
    const boton = document.createElement('button');
    boton.id = 'btn-comenzar';
    boton.textContent = 'COMENZAR JUEGO';
    
    contenedorBoton.appendChild(boton);
    main.appendChild(contenedorBoton);
}

export function ocultarBotonComenzar() {
    const contenedor = document.getElementById('contenedor-boton-inicio');
    contenedor.classList.add('oculto');
}

export function mostrarTablero() {
    tableroContainer.classList.remove('oculto');
    infoContainer.classList.remove('oculto');
}

export function ocultarTablero() {
    tableroContainer.classList.add('oculto');
    infoContainer.classList.add('oculto');
}

export function dibujarTablero(celdas, funcionClick) {
    tableroContainer.innerHTML = ''; 
    const tabla = document.createElement('table');
    
    for (let i = 0; i < celdas.length; i++) {
        const fila = document.createElement('tr');
        for (let j = 0; j < celdas[i].length; j++) {
            const celda = document.createElement('td');
            celda.textContent = celdas[i][j];

            celda.dataset.fila = i;
            celda.dataset.col = j;

            celda.addEventListener('click', funcionClick);

            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }
    tableroContainer.appendChild(tabla);
}

export function crearPanelInfo(tamTab, palabras) {
    infoContainer.innerHTML = '';
    
    const titulo = document.createElement('h2');
    titulo.textContent = 'Información';
    infoContainer.appendChild(titulo);
    
    const tamInfo = document.createElement('p');
    tamInfo.textContent = 'Tamaño del tablero: ' + tamTab + 'x' + tamTab;
    infoContainer.appendChild(tamInfo);

    const subtitulo = document.createElement('h3');
    subtitulo.textContent = 'Palabras a buscar:';
    infoContainer.appendChild(subtitulo);

    const lista = document.createElement('ul');
    lista.id = 'lista-palabras';
    
    [...palabras].sort().forEach(function(p) {
        const item = document.createElement('li');
        item.textContent = p;
        lista.appendChild(item);
    });
    
    infoContainer.appendChild(lista);
}

export function tacharDeLista(palabra) {
    const items = document.querySelectorAll('#lista-palabras li');
    items.forEach(item => {
        if (item.textContent === palabra && !item.classList.contains('tachado')) {
            item.classList.add('tachado');
        }
    });
}

export function crearRelojJuego() {
    const relojJuegoDiv = document.createElement("div");
    relojJuegoDiv.id = "reloj-juego";
    relojJuegoDiv.textContent = '00:00';
    
    main.insertBefore(relojJuegoDiv, contenedorJuego);
}

export function actualizarRelojJuego(segundos) {
    const relojJuegoDiv = document.getElementById('reloj-juego');
    relojJuegoDiv.textContent = formatearSegundos(segundos);
}

// Función auxiliar para mostrar "01:30" en vez de "90"
function formatearSegundos(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    const minStr = minutos.toString().padStart(2, '0');
    const segStr = segs.toString().padStart(2, '0');
    return minStr + ':' + segStr;
}

export function crearReloj() {
    const relojDiv = document.createElement("div");
    relojDiv.id = "reloj";
    
    const autor = document.createElement('p');
    autor.textContent = 'Enrique Nieto Lorenzo';

    pie.append(relojDiv, autor);

    function getHora() {
        const fecha = new Date();
        const h = fecha.getHours().toString().padStart(2, '0');
        const m = fecha.getMinutes().toString().padStart(2, '0');
        const s = fecha.getSeconds().toString().padStart(2, '0');
        relojDiv.textContent = h + ':' + m + ':' + s;
    }
    
    getHora();
    setInterval(getHora, 1000);
}

export function crearTablaPuntuaciones() {
    const seccionPuntuaciones = document.createElement('div');
    seccionPuntuaciones.id = 'seccion-puntuaciones';
    
    const titulo = document.createElement('h2');
    titulo.textContent = 'Top 3 Puntuaciones';
    
    const tabla = document.createElement('table');
    tabla.id = 'tabla-puntuaciones';
    
    const thead = document.createElement('thead');
    const filaCabecera = document.createElement('tr');
    
    const th1 = document.createElement('th');
    
    const th2 = document.createElement('th');
    th2.textContent = 'Nombre';
    
    const th3 = document.createElement('th');
    th3.textContent = 'Tiempo';
    
    filaCabecera.appendChild(th1);
    filaCabecera.appendChild(th2);
    filaCabecera.appendChild(th3);
    thead.appendChild(filaCabecera);
    
    const tbody = document.createElement('tbody');
    tbody.id = 'cuerpo-puntuaciones';
    
    // Crear 3 filas para las posiciones del top
    for (let i = 1; i <= 3; i++) {
        const fila = document.createElement('tr');
        
        const celdaPosicion = document.createElement('td');
        celdaPosicion.textContent = i;
        
        const celdaNombre = document.createElement('td');
        const inputNombre = document.createElement('input');
        inputNombre.type = 'text';
        inputNombre.className = 'input-nombre';
        inputNombre.disabled = true;
        inputNombre.dataset.posicion = i;
        celdaNombre.appendChild(inputNombre);
        
        const celdaTiempo = document.createElement('td');
        celdaTiempo.className = 'celda-tiempo';
        celdaTiempo.dataset.posicion = i;
        celdaTiempo.textContent = '--:--';
        
        fila.appendChild(celdaPosicion);
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaTiempo);
        
        tbody.appendChild(fila);
    }
    
    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    
    seccionPuntuaciones.appendChild(titulo);
    seccionPuntuaciones.appendChild(tabla);
    
    infoContainer.appendChild(seccionPuntuaciones);
}

export function actualizarTablaPuntuaciones(puntuaciones) {
    for (let i = 1; i <= 3; i++) {
        const inputNombre = document.querySelector('.input-nombre[data-posicion="' + i + '"]');
        const celdaTiempo = document.querySelector('.celda-tiempo[data-posicion="' + i + '"]');
        
        const datos = puntuaciones[i - 1]; // Array base 0

        if (datos) {
            inputNombre.value = datos.nombre;
            inputNombre.disabled = true;
            // Formateamos el tiempo que ahora viene como número (segundos)
            celdaTiempo.textContent = formatearSegundos(datos.puntuacion);
        } else {
            inputNombre.value = '';
            inputNombre.disabled = true;
            celdaTiempo.textContent = '--:--';
        }
    }
}

export function habilitarInputNombre(posicion) {
    const inputNombre = document.querySelector('.input-nombre[data-posicion="' + posicion + '"]');
    inputNombre.disabled = false;
    inputNombre.focus();
    inputNombre.placeholder = 'Escribe tu nombre';
}

export function obtenerNombreInput(posicion) {
    const inputNombre = document.querySelector('.input-nombre[data-posicion="' + posicion + '"]');
    if (inputNombre.value.trim() !== '') {
        return inputNombre.value.trim();
    }
    return 'Anónimo';
}