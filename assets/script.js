import { cartas } from "../data/cartas.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================
     MENÚ MÓVIL
  ========================================== */

  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }


  /* ==========================================
     ELEMENTOS DEL BUSCADOR
  ========================================== */

  const contenedor = document.getElementById("contenedor-imagenes");
  const loader = document.getElementById("loader");
  const inputBuscador = document.getElementById("buscador");
  const btnBuscar = document.getElementById("btn-buscar");
  const contador = document.getElementById("contador-cartas");


  /* ==========================================
     GALERÍA DE CARTAS
  ========================================== */

  if (contenedor && loader && inputBuscador) {

    const carpeta =
      "./assets/images/listado-cartas-skillblast/";

    const cantidadPorCarga = 30;

    let indiceActual = 0;
    let filtro = "";


    /* ------------------------------------------
       LOADER DE SCROLL
    ------------------------------------------ */

    let scrollLoader = document.getElementById("scroll-loader");

    if (!scrollLoader) {

      scrollLoader = document.createElement("div");

      scrollLoader.id = "scroll-loader";
      scrollLoader.className = "text-center py-4";
      scrollLoader.textContent = "Cargando más cartas...";

      contenedor.parentElement.appendChild(scrollLoader);
    }


    /* ------------------------------------------
       NORMALIZAR TEXTO
       
       Permite buscar:
       Haruka
       HARUKA
       haruka
       etc.
       
       También elimina tildes.
    ------------------------------------------ */

    function normalizarTexto(texto) {

      return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    }


    /* ------------------------------------------
       OBTENER DATOS DE UNA CARTA
    ------------------------------------------ */

    function obtenerNumero(carta) {
      return carta["numero de carta"];
    }

    function obtenerNombre(carta) {
      return carta.nombre || "";
    }

    function obtenerArquetipo(carta) {
      return carta.arquetipo || "";
    }


    /* ------------------------------------------
       FILTRAR CARTAS
    ------------------------------------------ */

    function obtenerListaFiltrada() {

      if (!filtro) {
        return cartas;
      }

      const termino = normalizarTexto(filtro);

      return cartas.filter((carta) => {

        const numero = normalizarTexto(
          obtenerNumero(carta)
        );

        const nombre = normalizarTexto(
          obtenerNombre(carta)
        );

        const arquetipo = normalizarTexto(
          obtenerArquetipo(carta)
        );

        return (
          numero.includes(termino) ||
          nombre.includes(termino) ||
          arquetipo.includes(termino)
        );

      });

    }


    /* ------------------------------------------
       ACTUALIZAR CONTADOR
    ------------------------------------------ */

    function actualizarContador(lista) {

      if (!contador) return;

      const cantidad = lista.length;

      if (!filtro) {

        contador.textContent =
          `Mostrando ${cantidad} cartas`;

        return;
      }

      if (cantidad === 0) {

        contador.textContent =
          "No se encontraron cartas.";

        return;
      }

      contador.textContent =
        `${cantidad} carta${cantidad !== 1 ? "s" : ""} encontrada${cantidad !== 1 ? "s" : ""}`;

    }


    /* ------------------------------------------
       CREAR CARTA
    ------------------------------------------ */

    function crearCarta(carta) {

      const numero = obtenerNumero(carta);
      const nombre = obtenerNombre(carta);
      const arquetipo = obtenerArquetipo(carta);

      const columna = document.createElement("div");

      columna.className =
        "carta-item";


      const imagen = document.createElement("img");

      const numeroFormateado =
        String(numero).padStart(3, "0");

      const nombreImagen =
        `BBX SP${numeroFormateado}`;

      imagen.src =
        carpeta + nombreImagen + ".jpg";

      imagen.alt =
        `Carta ${numero}: ${nombre}`;

      imagen.loading = "lazy";

      imagen.className =
        "carta-imagen";


      /* --------------------------------------
         Información de la carta
      -------------------------------------- */

      const informacion =
        document.createElement("div");

      informacion.className =
        "carta-datos";


      const numeroElemento =
        document.createElement("p");

      numeroElemento.className =
        "carta-numero";

      numeroElemento.textContent =
        `#${numero}`;


      const nombreElemento =
        document.createElement("h3");

      nombreElemento.className =
        "carta-nombre";

      nombreElemento.textContent =
        nombre;


      const arquetipoElemento =
        document.createElement("p");

      arquetipoElemento.className =
        "carta-arquetipo";

      arquetipoElemento.textContent =
        `Arquetipo: ${arquetipo}`;


      informacion.appendChild(numeroElemento);
      informacion.appendChild(nombreElemento);
      informacion.appendChild(arquetipoElemento);


      columna.appendChild(imagen);
      columna.appendChild(informacion);


      return columna;

    }


    /* ------------------------------------------
       CARGAR CARTAS
    ------------------------------------------ */

    function cargarImagenes(reset = false) {

      const lista =
        obtenerListaFiltrada();


      if (reset) {

        contenedor.innerHTML = "";

        indiceActual = 0;

      }


      actualizarContador(lista);


      /* Si no hay resultados */

      if (lista.length === 0) {

        contenedor.innerHTML = "";

        const mensaje =
          document.createElement("div");

        mensaje.className =
          "col-12 text-center py-5";

        mensaje.innerHTML = `
          <h3>No encontramos cartas 😢</h3>
          <p>
            Intenta buscar por número, nombre o arquetipo.
          </p>
        `;

        contenedor.appendChild(mensaje);

        loader.classList.add("hidden");

        scrollLoader.style.display = "none";

        return;
      }


      /* Mostrar loader */

      if (indiceActual < lista.length) {
        scrollLoader.style.display = "block";
      }


      setTimeout(() => {

        let cargadas = 0;


        while (
          cargadas < cantidadPorCarga &&
          indiceActual < lista.length
        ) {

          const carta =
            lista[indiceActual];

          const elementoCarta =
            crearCarta(carta);

          contenedor.appendChild(
            elementoCarta
          );

          indiceActual++;
          cargadas++;

        }


        scrollLoader.style.display =
          "none";


        /* Ocultar loader principal */

        loader.classList.add("hidden");

        contenedor.classList.remove("hidden");


        /* Si ya cargamos todas */

        if (indiceActual >= lista.length) {

          scrollLoader.style.display =
            "none";

        }

      }, 300);

    }


    /* ==========================================
       SCROLL INFINITO
    ========================================== */

    let scrollTimeout;

    window.addEventListener("scroll", () => {

      if (scrollTimeout) return;


      scrollTimeout = setTimeout(() => {

        const lista =
          obtenerListaFiltrada();


        const cercaDelFinal =
          window.innerHeight +
          window.scrollY >=
          document.body.offsetHeight - 300;


        if (
          cercaDelFinal &&
          indiceActual < lista.length
        ) {

          cargarImagenes();

        }


        scrollTimeout = null;

      }, 200);

    });


    /* ==========================================
       BUSCADOR
    ========================================== */

    function realizarBusqueda() {

      filtro =
        inputBuscador.value.trim();

      cargarImagenes(true);

    }


    /* Buscar mientras escribe */

    inputBuscador.addEventListener(
      "input",
      realizarBusqueda
    );


    /* Buscar mediante botón */

    if (btnBuscar) {

      btnBuscar.addEventListener(
        "click",
        realizarBusqueda
      );

    }


    /* Enter para buscar */

    inputBuscador.addEventListener(
      "keydown",
      (evento) => {

        if (evento.key === "Enter") {

          realizarBusqueda();

        }

      }
    );


    /* ==========================================
       CARGA INICIAL
    ========================================== */

    cargarImagenes();

  }


  /* ==========================================
     ANIMACIONES FADE-IN
  ========================================== */

  const faders =
    document.querySelectorAll(".fade-in");

  if (faders.length) {

    const appearOptions = {

      threshold: 0.1,

      rootMargin:
        "0px 0px -50px 0px"

    };


    const appearOnScroll =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "show"
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        appearOptions
      );


    faders.forEach((fader) => {

      appearOnScroll.observe(fader);

    });

  }


  /* ==========================================
     SWIPER
  ========================================== */

  if (document.querySelector(".mySwiper")) {

    const swiper =
      new Swiper(".mySwiper", {

        direction: "vertical",

        slidesPerView: 2,

        spaceBetween: 20,

        navigation: {

          nextEl:
            ".swiper-button-next",

          prevEl:
            ".swiper-button-prev"

        },

        pagination: {

          el:
            ".swiper-pagination",

          clickable: true

        }

      });

  }

});