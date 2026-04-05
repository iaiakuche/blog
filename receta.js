const menu = document.getElementById("menu");
const links = document.getElementById("links");
menu.addEventListener("click", () => {
    menu.textContent = links.classList.toggle("show") ? "X" : "☰";
});

const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

fetch("recetas.json")
    .then(response => response.json())
    .then(recetas => {
        const receta = recetas[id];

        if (!receta) {
            document.querySelector(".contenedor-receta").innerHTML =
                "<p style='padding:60px;text-align:center;color:#888'>Receta no encontrada.</p>";
            return;
        }

        document.getElementById("titulo-receta").textContent    = receta.titulo;
        document.getElementById("subtitulo-receta").textContent = receta.subtitulo || "";
        document.title = receta.titulo;

        const img = document.getElementById("imagen-receta");
        img.src = receta.imagen;
        img.alt = receta.titulo;

        document.getElementById("descripcion-receta").textContent = receta.descripcion;
        document.getElementById("meta-tiempo").textContent        = receta.tiempo;
        document.getElementById("meta-porciones").textContent     = receta.porciones;
        document.getElementById("meta-dificultad").textContent    = receta.dificultad;

        const listaIng = document.getElementById("lista-ingredientes");
        receta.ingredientes.forEach(ing => {
            const li = document.createElement("li");
            li.textContent = ing;
            listaIng.appendChild(li);
        });

        const listaPasos = document.getElementById("lista-pasos");
        receta.pasos.forEach(paso => {
            const li = document.createElement("li");
            li.textContent = paso;
            listaPasos.appendChild(li);
        });

        if (receta.consejo) {
            document.getElementById("nota-texto").textContent    = receta.consejo;
            document.getElementById("nota-receta").style.display = "block";
        }
    })
    .catch(error => console.error("Error cargando recetas:", error));

function agregarComentario() {
    const nombre = document.getElementById("input-nombre").value.trim();
    const texto  = document.getElementById("input-texto").value.trim();
    if (!nombre || !texto) {
        alert("Por favor completá tu nombre y comentario.");
        return;
    }
    const lista   = document.getElementById("lista-comentarios");
    const inicial = nombre.charAt(0).toUpperCase();
    const item    = document.createElement("div");
    item.className    = "comentario-item";
    item.style.animation = "fadeIn 0.3s ease";
    item.innerHTML =
        '<div class="comentario-meta">' +
            '<div class="comentario-avatar">' + inicial + "</div>" +
            '<span class="comentario-autor">'  + nombre  + "</span>" +
            '<span class="comentario-fecha">Ahora</span>' +
        "</div>" +
        '<p class="comentario-texto">' + texto + "</p>";
    lista.prepend(item);
    document.getElementById("input-nombre").value = "";
    document.getElementById("input-texto").value  = "";
}
