const main = document.querySelector("main");
const footerContainer = document.getElementById("contenedor-reloj-footer");

// Crear contenedor principal del juego
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
    boton.innerHTML = '<i class="fa-solid fa-play"></i> COMENZAR JUEGO';
    
    contenedorBoton.appendChild(boton);
    main.insertBefore(contenedorBoton, contenedorJuego);
}

export function ocultarBotonComenzar() {
    const contenedor = document.getElementById('contenedor-boton-inicio');
    if (contenedor) contenedor.classList.add('oculto');
}

export function mostrarTablero() {
    tableroContainer.classList.remove('oculto');
    infoContainer.classList.remove('oculto');
    contenedorJuego.classList.remove('oculto');
}

export function ocultarTablero() {
    tableroContainer.classList.add('oculto');
    infoContainer.classList.add('oculto');
    contenedorJuego.classList.add('oculto');
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
    titulo.innerHTML = '<i class="fa-solid fa-circle-info"></i> Información';
    infoContainer.appendChild(titulo);
    
    const tamInfo = document.createElement('p');
    tamInfo.innerHTML = `<strong>Tamaño:</strong> ${tamTab}x${tamTab}`;
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
    if(document.getElementById("reloj-juego")) return;

    const relojJuegoDiv = document.createElement("div");
    relojJuegoDiv.id = "reloj-juego";
    relojJuegoDiv.textContent = '00:00';
    
    main.insertBefore(relojJuegoDiv, contenedorJuego);
}

export function actualizarRelojJuego(segundos) {
    const relojJuegoDiv = document.getElementById('reloj-juego');
    if(relojJuegoDiv) relojJuegoDiv.textContent = formatearSegundos(segundos);
}

function formatearSegundos(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    const minStr = minutos.toString().padStart(2, '0');
    const segStr = segs.toString().padStart(2, '0');
    return minStr + ':' + segStr;
}

export function crearReloj() {
    const contenedorReloj = document.getElementById("contenedor-reloj-footer");
    if (!contenedorReloj) return; 

    const relojDiv = document.createElement("div");
    relojDiv.id = "reloj";
    
    contenedorReloj.appendChild(relojDiv);

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
    titulo.innerHTML = '<i class="fa-solid fa-trophy"></i> Top 3';
    
    const tabla = document.createElement('table');
    tabla.id = 'tabla-puntuaciones';
    
    const thead = document.createElement('thead');
    const filaCabecera = document.createElement('tr');
    
    const th1 = document.createElement('th');
    th1.textContent = '#';
    const th2 = document.createElement('th');
    th2.textContent = 'Nombre';
    const th3 = document.createElement('th');
    th3.textContent = 'Tiempo';
    
    filaCabecera.append(th1, th2, th3);
    thead.appendChild(filaCabecera);
    
    const tbody = document.createElement('tbody');
    tbody.id = 'cuerpo-puntuaciones';
    
    for (let i = 1; i <= 3; i++) {
        const fila = document.createElement('tr');
        
        const celdaPosicion = document.createElement('td');
        celdaPosicion.textContent = i;
        celdaPosicion.style.textAlign = "center";
        celdaPosicion.style.fontWeight = "bold";
        celdaPosicion.style.color = "var(--color-principal)";
        
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
        
        fila.append(celdaPosicion, celdaNombre, celdaTiempo);
        tbody.appendChild(fila);
    }
    
    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    seccionPuntuaciones.append(titulo, tabla);
    infoContainer.appendChild(seccionPuntuaciones);
}

export function actualizarTablaPuntuaciones(puntuaciones) {
    for (let i = 1; i <= 3; i++) {
        const inputNombre = document.querySelector('.input-nombre[data-posicion="' + i + '"]');
        const celdaTiempo = document.querySelector('.celda-tiempo[data-posicion="' + i + '"]');
        const datos = puntuaciones[i - 1]; 

        if (datos) {
            inputNombre.value = datos.nombre;
            inputNombre.disabled = true;
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
    if(inputNombre) {
        inputNombre.disabled = false;
        inputNombre.focus();
        inputNombre.placeholder = '¡Récord! Tu nombre...';
    }
}

export function obtenerNombreInput(posicion) {
    const inputNombre = document.querySelector('.input-nombre[data-posicion="' + posicion + '"]');
    if (inputNombre && inputNombre.value.trim() !== '') {
        return inputNombre.value.trim();
    }
    return 'Anónimo';
}