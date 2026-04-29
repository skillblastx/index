document.addEventListener("DOMContentLoaded", () => {
  // ===== Menú móvil =====
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  // ===== Scroll infinito de cartas =====
  const contenedor = document.getElementById("contenedor-imagenes");
  const loader = document.getElementById("loader");

  if (contenedor && loader) {
    // Crear loader dinámico si no existe
    let scrollLoader = document.getElementById("scroll-loader");
    if (!scrollLoader) {
      scrollLoader = document.createElement('div');
      scrollLoader.id = "scroll-loader";
      scrollLoader.className = "hidden text-center py-6 text-yellow-600 font-semibold";
      scrollLoader.textContent = "Cargando más cartas...";
      document.body.appendChild(scrollLoader);
    }

    const carpeta = "./assets/images/listado-cartas-skillblast/";
    const nombresImagenes = Array.from({ length: 369 }, (_, i) => "BBX SP" + String(i + 1).padStart(3, '0'));
    let indiceActual = 0;
    const cantidadPorCarga = 30;

    function cargarImagenes() {
      scrollLoader.classList.remove("hidden");
      setTimeout(() => {
        for (let i = 0; i < cantidadPorCarga; i++) {
          if (indiceActual >= nombresImagenes.length) break;

          const nombreImg = nombresImagenes[indiceActual];
          const nuevaImagen = document.createElement('img');
          nuevaImagen.src = carpeta + nombreImg + ".jpg";
          nuevaImagen.alt = nombreImg;
          nuevaImagen.className = "w-full h-auto rounded-3xl shadow transition-transform duration-200 hover:scale-105";

          contenedor.appendChild(nuevaImagen);
          indiceActual++;
        }
        scrollLoader.classList.add("hidden");

        // Mostrar imágenes la primera vez
        if (indiceActual > 0) {
          loader.classList.add("hidden");
          contenedor.classList.remove("hidden");
        }
      }, 600);
    }

    // Scroll infinito con throttle simple
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
          if (indiceActual < nombresImagenes.length) {
            cargarImagenes();
          }
        }
        scrollTimeout = null;
      }, 200);
    });

    // Cargar primer bloque
    cargarImagenes();
  }

  // ===== Animación de los textos =====
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

  // ===== Inicializar Swiper =====
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
