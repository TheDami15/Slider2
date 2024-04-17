const ubicacionesArrays = [
    cercanasTN, cercanasFV, cercanasGC, cercanasLZ, cercanasLP, cercanasEH, cercanasLGR
];

function obtenerSkePorUrl(url) {
    for (let array of ubicacionesArrays) {
        const ubicacion = array.find(ubic => ubic.es.link === url || ubic.en.link === url || ubic.it.link === url || ubic.de.link === url);
        if (ubicacion) {
            return ubicacion.ske;
        }
    }
    return null;
}

function buscarYMostrar(url, skeEncontrado) {
    for (let array of ubicacionesArrays) {
        const indiceActual = array.findIndex(ubicacion => ubicacion.es.link === url || ubicacion.en.link === url || ubicacion.it.link === url || ubicacion.de.link === url);

        if (indiceActual !== -1) {
            const ubicacionActual = array[indiceActual];
            const idiomaEncontrado = Object.keys(ubicacionActual).find(idioma => ubicacionActual[idioma].link === url);
            const datosIdioma = ubicacionActual[idiomaEncontrado];

            document.getElementById('ubicaciones').innerHTML = `<li>Ubicación: ${datosIdioma.tit}, Subtítulo: ${datosIdioma.stitl}, Link: ${datosIdioma.link}, Ske: ${skeEncontrado}</li>`;

            actualizarSlider(array, indiceActual, idiomaEncontrado);
            break;
        }
    }
}

function actualizarSlider(array, indiceActual, idiomaEncontrado) {
    let sliderHTML = '';
    let dotsHTML = '';

    // Calcular los índices inicial y final para mostrar los slides
    let inicio = Math.max(0, indiceActual - 3);
    let final = Math.min(array.length - 1, indiceActual + 3);

    // Ajustar para asegurar al menos un elemento antes y después, si es posible
    if (indiceActual - inicio < 1 && indiceActual + 1 <= final) {
        inicio = Math.max(0, indiceActual - 1);
    }
    if (final - indiceActual < 1 && inicio <= indiceActual - 1) {
        final = Math.min(array.length - 1, indiceActual + 1);
    }

    // Construir el HTML de cada slide y los dots dentro del rango
    for (let i = inicio; i <= final; i++) {
        if (array[i] && array[i].ske) {
            sliderHTML += `
                <div class="item" style="display: none;">
                    <div class="titulo">${array[i][idiomaEncontrado].tit}-${array[i][idiomaEncontrado].stitl}</div>
                    <img src="${array[i].ske}" alt="Slide ${i - inicio + 1}">
                </div>`;
            // Agregar un dot para cada slide
            dotsHTML += `<li></li>`;
        }
    }
    const sliderList = document.querySelector('.list');
    sliderList.innerHTML = sliderHTML;

    // Actualizar los dots en el DOM
    const dotsContainer = document.querySelector('.slider .dots');
    dotsContainer.innerHTML = dotsHTML;

    // Agregar eventos de clic a cada dot
    const dots = document.querySelectorAll('.slider .dots li');
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            mostrarSlide(i);
        });
    });

    // Determinar el índice inicial para mostrar y activar el dot correspondiente
    let inicioSlider = 3;
    if (final - inicio + 1 < 7) {
        inicioSlider = indiceActual - inicio;
    }
    mostrarSlide(inicioSlider);  // Iniciar en un índice ajustado basado en la cantidad de slides disponibles
}


const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
let currentSlideIndex = 0;

prevButton.addEventListener('click', function() {
    mostrarSlide(Math.max(0, --currentSlideIndex));
});

nextButton.addEventListener('click', function() {
    const slides = document.querySelectorAll('.list .item');
    mostrarSlide(Math.min(slides.length - 1, ++currentSlideIndex));
});

function mostrarSlide(index) {
    const slides = document.querySelectorAll('.list .item');
    const dots = document.querySelectorAll('.slider .dots li');

    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });

    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    currentSlideIndex = index;
}

const inputUrl = document.getElementById('urlInput');
inputUrl.addEventListener('change', function(event) {
    const url = event.target.value;
    const skeEncontrado = obtenerSkePorUrl(url);
    if (skeEncontrado) {
        buscarYMostrar(url, skeEncontrado);
    } else {
        alert('No se encontró la ubicación especificada.'); // Manejo simple de errores
    }
});