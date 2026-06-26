document.addEventListener("DOMContentLoaded", () => {
  // Menú móvil
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }
// Scroll infinito de cartas & buscador
const contenedor = document.getElementById("contenedor-imagenes");
const loader = document.getElementById("loader");
const inputBuscador = document.getElementById("buscador");

if (contenedor && loader) {

  let scrollLoader = document.getElementById("scroll-loader");
  if (!scrollLoader) {
    scrollLoader = document.createElement('div');
    scrollLoader.id = "scroll-loader";
    scrollLoader.className = "hidden text-center py-6 text-yellow-600 font-semibold";
    scrollLoader.textContent = "Cargando más cartas...";
    document.body.appendChild(scrollLoader);
  }
// Cambiar número a medida se agregan más cartas
  const carpeta = "./assets/images/listado-cartas-skillblast/";
  const nombresImagenes = Array.from(
    { length: 406 },
    (_, i) => "BBX SP" + String(i + 1).padStart(3, '0')
  );

  let indiceActual = 0;
  const cantidadPorCarga = 30;

  // Filtro actual:
  let filtro = "";

  // Devolver lista filtrada
  function obtenerListaFiltrada() {
    if (!filtro) return nombresImagenes;
    return nombresImagenes.filter(nombre =>
      nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  }

  function cargarImagenes(reset = false) {
    const lista = obtenerListaFiltrada();

    scrollLoader.classList.remove("hidden");

    setTimeout(() => {

      if (reset) {
        contenedor.innerHTML = "";
        indiceActual = 0;
      }

      let cargadas = 0;

      while (cargadas < cantidadPorCarga && indiceActual < lista.length) {
        const nombreImg = lista[indiceActual];

        const img = document.createElement("img");
        img.src = carpeta + nombreImg + ".jpg";
        img.alt = nombreImg;
        img.className =
          "w-full h-auto rounded-3xl shadow transition-transform duration-200 hover:scale-105";

        contenedor.appendChild(img);

        indiceActual++;
        cargadas++;
      }

      scrollLoader.classList.add("hidden");

      if (indiceActual > 0) {
        loader.classList.add("hidden");
        contenedor.classList.remove("hidden");
      }

    }, 600);
  }

  // Scroll Infinito
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) return;

    scrollTimeout = setTimeout(() => {
      const lista = obtenerListaFiltrada();

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        if (indiceActual < lista.length) {
          cargarImagenes();
        }
      }

      scrollTimeout = null;
    }, 200);
  });

  // Buscador
  inputBuscador.addEventListener("input", (e) => {
    filtro = e.target.value.trim();

    indiceActual = 0;
    cargarImagenes(true);
  });

  // Carga inicial
  cargarImagenes();
}

  // Animación Textos
  const faders = document.querySelectorAll(".fade-in");
  if (faders.length) {
    const appearOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));
  }

  // Swiper
  if (document.querySelector(".mySwiper")) {
    const swiper = new Swiper(".mySwiper", {
      direction: "vertical",
      slidesPerView: 2,
      spaceBetween: 20,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }
});
