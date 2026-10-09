
"use strict";

// ==========================================
// 1. FUEGOS ARTIFICIALES
// ==========================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let ancho = window.innerWidth;
let alto = window.innerHeight;

let fuegos = [];
let particulas = [];
let ultimoDisparo = 0;
let animacionIniciada = false;
let temporizadorEscena = null;
let temporizadorProgreso = null;
let escenaActual = 0;

const duracionEscena = 10000;

const paletaColores = [
  ["rgba(255,79,200,", "rgba(255,255,255,"],
  ["rgba(168,85,247,", "rgba(255,155,229,"],
  ["rgba(0,191,255,", "rgba(255,255,255,"],
  ["rgba(255,105,180,", "rgba(255,215,0,"],
  ["rgba(255,255,255,", "rgba(255,79,200,"],
  ["rgba(255,182,193,", "rgba(168,85,247,"]
];

function redimensionarCanvas() {
  ancho = window.innerWidth;
  alto = window.innerHeight;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.floor(ancho * dpr);
  canvas.height = Math.floor(alto * dpr);

  canvas.style.width = ancho + "px";
  canvas.style.height = alto + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", redimensionarCanvas);
redimensionarCanvas();

function aleatorio(min, max) {
  return Math.random() * (max - min) + min;
}

function crearFuego(xObjetivo, yObjetivo) {
  const x = aleatorio(ancho * 0.12, ancho * 0.88);
  const y = alto + 5;
  const dx = xObjetivo - x;
  const dy = yObjetivo - y;
  const distancia = Math.hypot(dx, dy) || 1;
  const velocidad = aleatorio(5, 8);

  fuegos.push({
    x,
    y,
    vx: dx / distancia * velocidad,
    vy: dy / distancia * velocidad,
    tx: xObjetivo,
    ty: yObjetivo,
    color: paletaColores[
      Math.floor(Math.random() * paletaColores.length)
    ],
    estela: [],
    vida: 0
  });
}

function explotar(x, y, colores) {
  // Menos partículas para mantener buen rendimiento en móviles.
  const cantidad = ancho < 600 ? 65 : 110;

  for (let i = 0; i < cantidad; i++) {
    const angulo = Math.random() * Math.PI * 2;
    const velocidad = aleatorio(1.1, 5.2);

    particulas.push({
      x,
      y,
      vx: Math.cos(angulo) * velocidad,
      vy: Math.sin(angulo) * velocidad,
      gravedad: aleatorio(0.012, 0.045),
      friccion: 0.985,
      alpha: 1,
      decaimiento: aleatorio(0.009, 0.018),
      color: Math.random() < 0.7 ? colores[0] : colores[1],
      tamano: aleatorio(0.8, 2)
    });
  }
}

function animarFuegos() {
  requestAnimationFrame(animarFuegos);

  // Deja una estela suave sin pintar un fondo opaco.
  ctx.fillStyle = "rgba(5, 2, 8, 0.18)";
  ctx.fillRect(0, 0, ancho, alto);

  if (
    animacionIniciada &&
    document.visibilityState === "visible" &&
    Date.now() - ultimoDisparo > 1000
  ) {
    crearFuego(
      aleatorio(ancho * 0.15, ancho * 0.85),
      aleatorio(alto * 0.08, alto * 0.48)
    );

    ultimoDisparo = Date.now();
  }

  for (let i = fuegos.length - 1; i >= 0; i--) {
    const f = fuegos[i];

    f.estela.push({ x: f.x, y: f.y });
    if (f.estela.length > 5) f.estela.shift();

    f.x += f.vx;
    f.y += f.vy;
    f.vida++;

    ctx.beginPath();

    if (f.estela.length) {
      ctx.moveTo(f.estela[0].x, f.estela[0].y);
    } else {
      ctx.moveTo(f.x, f.y);
    }

    ctx.lineTo(f.x, f.y);
    ctx.strokeStyle = f.color[0] + "0.95)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const llego =
      Math.hypot(f.tx - f.x, f.ty - f.y) < 10;

    if (llego || f.vida > 180) {
      explotar(f.x, f.y, f.color);
      fuegos.splice(i, 1);
    }
  }

  for (let i = particulas.length - 1; i >= 0; i--) {
    const p = particulas[i];

    p.x += p.vx;
    p.y += p.vy;
    p.vx *= p.friccion;
    p.vy = p.vy * p.friccion + p.gravedad;
    p.alpha -= p.decaimiento;

    if (p.alpha <= 0) {
      particulas.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.tamano, 0, Math.PI * 2);
    ctx.fillStyle = p.color + Math.max(0, p.alpha) + ")";
    ctx.fill();
  }
}

animarFuegos();

// ==========================================
// 2. HISTORIA DE LA AMISTAD
// ==========================================

const escenas = [
  {
    capitulo: "CAPÍTULO 01 · EL COMIENZO",
    decoracion: "🎓 ✨",
    titulo: "Todo comenzó en la universidad...",
    texto:
      "Entre clases, trabajos y días que parecían iguales, " +
      "dos personas se conocieron sin imaginar los recuerdos " +
      "que llegarían a compartir.",
    indicacion: "",
    chico: "👨🏻‍🎓",
    chica: "👩🏼‍🎓",
    movimiento: "juntos"
  },
  {
    capitulo: "CAPÍTULO 02 · UNA SALIDA",
    decoracion: "☕ 🌷",
    titulo: "Y llegaron los primeros recuerdos",
    texto:
      "Una salida, conversaciones interminables, bromas " +
      "y risas que hacían que hasta el día más sencillo " +
      "se convirtiera en un recuerdo especial.",
    indicacion: "",
    chico: "🧑🏻‍🦱",
    chica: "👱🏻‍♀️",
    movimiento: "juntos"
  },
  {
    capitulo: "CAPÍTULO 03 · LOS MOMENTOS DIFÍCILES",
    decoracion: "🌧️ 💭",
    titulo: "Pero no todos los días fueron fáciles",
    texto:
      "También llegaron los malentendidos, las diferencias " +
      "y ese silencio que a veces aparece entre dos personas. " +
      "Hubo momentos en los que parecía que todo se alejaba.",
    indicacion: "",
    chico: "😔",
    chica: "😞",
    movimiento: "lejos"
  },
  {
    capitulo: "CAPÍTULO 04 · VOLVER A ENCONTRARSE",
    decoracion: "🌈 🫶",
    titulo: "Porque una amistad merece ser cuidada",
    texto:
      "Con el tiempo llegaron nuevas conversaciones, " +
      "comprensión y la oportunidad de dejar atrás lo que dolía. " +
      "Poco a poco, volvieron a encontrarse como amigos.",
    indicacion: "",
    chico: "🙂",
    chica: "😊",
    movimiento: "acercarse"
  },
  {
    capitulo: "CAPÍTULO 05 · UNA AMISTAD ESPECIAL",
    decoracion: "🌟 🎆",
    titulo: "Y aquí siguen, compartiendo la vida",
    texto:
      "No como una historia de amor, sino como una amistad " +
      "real: dos personas que han vivido momentos buenos y malos " +
      "y que saben que cada recuerdo forma parte de su historia.",
    indicacion: "",
    chico: "😎",
    chica: "🥰",
    movimiento: "felices"
  },
  {
    capitulo: "CAPÍTULO 06 · LO QUE DE VERDAD IMPORTA",
    decoracion: "💗 ✨",
    titulo: "Hay personas que dejan huella para siempre",
    texto:
      "La vida cambiará, habrá nuevos sueños y muchos caminos " +
      "por recorrer. Pero siempre quedará el cariño por todo " +
      "lo compartido y la gratitud de haberse conocido.",
    indicacion: "",
    chico: "🫂",
    chica: "💖",
    movimiento: "felices"
  }
];

const inicio = document.getElementById("inicio");
const historia = document.getElementById("historia");
const final = document.getElementById("final");

const contador = document.getElementById("contador");
const decoracion = document.getElementById("decoracion");
const tituloEscena = document.getElementById("tituloEscena");
const textoEscena = document.getElementById("textoEscena");
const indicacion = document.getElementById("indicacion");
const chico = document.getElementById("chico");
const chica = document.getElementById("chica");
const barraProgreso = document.getElementById("barraProgreso");

const botonSorpresa = document.getElementById("botonSorpresa");
const botonSaltar = document.getElementById("saltar");
const botonRepetir = document.getElementById("repetir");

function mostrarEscena(indice) {
  clearTimeout(temporizadorEscena);
  clearInterval(temporizadorProgreso);

  if (indice >= escenas.length) {
    mostrarFinal();
    return;
  }

  escenaActual = indice;
  const escena = escenas[indice];

  contador.textContent = escena.capitulo;
  decoracion.textContent = escena.decoracion;
  tituloEscena.textContent = escena.titulo;
  textoEscena.textContent = escena.texto;
  indicacion.textContent = escena.indicacion;

  chico.querySelector(".emoji-personaje").textContent = escena.chico;
  chica.querySelector(".emoji-personaje").textContent = escena.chica;

  const estilo = escena.movimiento;

  chico.style.opacity = estilo === "lejos" ? "0.65" : "1";
  chica.style.opacity = estilo === "lejos" ? "0.65" : "1";

  chico.style.transform =
    estilo === "lejos" ? "translateX(-28px)" :
    estilo === "acercarse" || estilo === "felices"
      ? "translateX(12px)" : "translateX(0)";

  chica.style.transform =
    estilo === "lejos" ? "translateX(28px)" :
    estilo === "acercarse" || estilo === "felices"
      ? "translateX(-12px)" : "translateX(0)";

  // Reiniciar la animación de entrada de los personajes.
  [chico, chica].forEach((personaje) => {
    personaje.style.animation = "none";
    void personaje.offsetWidth;
    personaje.style.animation = "";
  });

  barraProgreso.style.transition = "none";
  barraProgreso.style.width = "0%";
  void barraProgreso.offsetWidth;

  barraProgreso.style.transition =
    `width ${duracionEscena}ms linear`;
  barraProgreso.style.width = "100%";

  let inicioTiempo = Date.now();

  temporizadorProgreso = setInterval(() => {
    if (document.visibilityState !== "visible") {
      inicioTiempo = Date.now();
    }
  }, 1000);

  temporizadorEscena = setTimeout(() => {
    mostrarEscena(indice + 1);
  }, duracionEscena);
}

function empezarSorpresa() {
  clearTimeout(temporizadorEscena);
  clearInterval(temporizadorProgreso);

  inicio.classList.add("oculto");
  final.classList.add("oculto");
  historia.classList.remove("oculto");

  document.body.classList.add("iniciado");

  fuegos = [];
  particulas = [];
  ctx.clearRect(0, 0, ancho, alto);

  animacionIniciada = true;
  ultimoDisparo = 0;

  mostrarEscena(0);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarFinal() {
  clearTimeout(temporizadorEscena);
  clearInterval(temporizadorProgreso);

  historia.classList.add("oculto");
  final.classList.remove("oculto");

  // Unos fuegos extra para celebrar el cumpleaños.
  for (let i = 0; i < 4; i++) {
    crearFuego(
      aleatorio(ancho * 0.15, ancho * 0.85),
      aleatorio(alto * 0.1, alto * 0.45)
    );
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

botonSorpresa.addEventListener("click", empezarSorpresa);

botonSaltar.addEventListener("click", () => {
  mostrarEscena(escenaActual + 1);
});

botonRepetir.addEventListener("click", empezarSorpresa);

// Mostrar un aviso si todavía no se ha añadido la fotografía.
const fotoAmiga = document.getElementById("fotoAmiga");
const avisoFoto = document.getElementById("avisoFoto");

fotoAmiga.addEventListener("error", () => {
  fotoAmiga.style.display = "none";
  avisoFoto.style.display = "flex";
});

fotoAmiga.addEventListener("load", () => {
  fotoAmiga.style.display = "block";
  avisoFoto.style.display = "none";
});
