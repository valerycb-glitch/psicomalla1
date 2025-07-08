const cursosData = [
  { ciclo: "I", codigo: "EG-131", nombre: "Matemática Básica", creditos: 4 },
  { ciclo: "II", codigo: "EDEP-236", nombre: "Psicoestadística", creditos: 4, prereq: "EG-131" },
  { ciclo: "III", codigo: "EDEP-231", nombre: "Bases Biológicas del Comportamiento", creditos: 4 },
  { ciclo: "III", codigo: "EDEP-331", nombre: "Procesos Cognitivos", creditos: 4, prereq: "EDEP-231" },
  { ciclo: "III", codigo: "EDEP-336", nombre: "Validación de Instrumentos Psicológicos", creditos: 3, prereq: "EDEP-236" },
  { ciclo: "IV", codigo: "EDEP-433", nombre: "Evaluación Psicológica I", creditos: 4, prereq: "EDEP-336" },
  { ciclo: "V", codigo: "EDEP-535", nombre: "Evaluación Psicológica II", creditos: 4, prereq: "EDEP-433" },
  // Agrega todos los cursos restantes según tu malla
];

const completados = JSON.parse(localStorage.getItem("completados") || "[]");
let totalCreditos = 0;

function crearMalla() {
  const malla = document.getElementById("malla");
  const ciclos = [...new Set(cursosData.map(c => c.ciclo))];

  ciclos.forEach(ciclo => {
    const divCiclo = document.createElement("div");
    divCiclo.classList.add("ciclo");
    divCiclo.innerHTML = `<h2>Ciclo ${ciclo}</h2>`;

    cursosData.filter(c => c.ciclo === ciclo).forEach(curso => {
      const div = document.createElement("div");
      div.className = "curso";
      div.setAttribute("data-codigo", curso.codigo);
      div.setAttribute("data-creditos", curso.creditos);
      if (curso.prereq) div.setAttribute("data-prereq", curso.prereq);

      div.innerHTML = `<strong>${curso.codigo}</strong> - ${curso.nombre} (${curso.creditos} créditos)<br>
      <button onclick="completarCurso(this)">Marcar como completado</button>`;

      if (completados.includes(curso.codigo)) {
        div.classList.add("completado");
        div.querySelector("button").disabled = true;
        totalCreditos += curso.creditos;
      } else if (curso.prereq && !completados.includes(curso.prereq)) {
        div.classList.add("bloqueado");
      }

      divCiclo.appendChild(div);
    });

    malla.appendChild(divCiclo);
  });

  document.getElementById("totalCreditos").innerText = totalCreditos;
}

function completarCurso(btn) {
  const curso = btn.parentElement;
  if (curso.classList.contains("completado")) return;

  curso.classList.add("completado");
  btn.disabled = true;

  const creditos = parseInt(curso.getAttribute("data-creditos"));
  totalCreditos += creditos;
  document.getElementById("totalCreditos").innerText = totalCreditos;

  const codigo = curso.getAttribute("data-codigo");
  completados.push(codigo);
  localStorage.setItem("completados", JSON.stringify(completados));

  document.querySelectorAll(`[data-prereq="${codigo}"]`).forEach(next => {
    next.classList.remove("bloqueado");
  });
}

// Crear la malla al cargar
window.onload = crearMalla;
